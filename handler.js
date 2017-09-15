'use strict';

process.env.TZ = 'Asia/Tokyo';

const { receiveMessage, deleteMessage } = require('./lib/sqs.js');
const { buildDlqInfoMessage, sendMessageToChatwork } = require('./lib/chatwork.js');

/**
 * SQSに対してポーリングを行い、メッセージがあればその内容をチャットワークに通知する。
 *
 * @param {Object} message SQSのメッセージオブジェクト
 */
function sendMessage(message) {
  return new Promise((resolve, reject) => {
    const roomId = process.env.CHATWORK_TARGET_ROOM_ID;
    sendMessageToChatwork(roomId, buildDlqInfoMessage(message)).then(() => {
      deleteMessage(message.ReceiptHandle).then(() => {
        console.log(`delete => [${message.MessageId}]`);
        resolve();
      }).catch(() => reject());
    });
  });
}

/**
 * SQSに対してポーリングを行い、メッセージがあればその内容をチャットワークに通知する。
 *
 * @param {Function} callback コールバック用関数
 */
function poll(callback) {
  receiveMessage().then((messages) => {
    const promises = messages.map((message) => { return sendMessage(message); });
    Promise.all(promises).then(() => {
      const result = `Messages received: ${messages.length}`;
      console.log(result);
      console.log('good end');
      callback(null, result);
    });
  }).catch((err) => { callback(err); });
}

// *******************************
//           (・(ェ)・)
// *******************************
module.exports.watch = (event, context, callback) => {
  console.log('start');
  try {
    poll(callback);
  } catch (err) {
    console.log(err, err.stack);
    callback(err);
  }
};
