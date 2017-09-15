'use strict';

const moment = require('moment');
const request = require('request');

/**
 * SQSのメッセージオブジェクトから障害通知用のメッセージを作成する。
 *
 * @param {Object} message SQSのメッセージオブジェクト
 * @return {String} 障害通知用のメッセージ
 */
const buildDlqInfoMessage = (message) => {
  // ベースとなる文章を作成する。
  let statement = ''
    + '[info][title]dlq-info[/title]'
    + `発生日時        : ${moment(Number(message.Attributes.SentTimestamp)).format('YYYY-MM-DD HH:mm:ss')}\n`
    + `メッセージ ID: ${message.MessageId}\n`
    + `本文               : ${message.Body}\n`;

  // MessageAttributesが定義されている場合、その内容も出力する。
  if (Object.hasOwnProperty.call(message, 'MessageAttributes')) {
    const attrStatements = Object.keys(message.MessageAttributes).map((key) => {
      return `${key}: ${message.MessageAttributes[key].StringValue}`;
    });
    statement += `[hr]${attrStatements.join('\n')}`;
  }

  return `${statement}[/info]`;
};

/**
 * Chatworkにメッセージを送る。
 *
 * @param {String} roomId ChatworkのルームID
 * @param {String} message メッセージ本文
 * @return {Promise}
 */
const sendMessageToChatwork = (roomId, message) => {
  return new Promise((resolve, reject) => {
    const options = {
      url: `https://api.chatwork.com/v2/rooms/${roomId}/messages`,
      headers: {
        'X-ChatWorkToken': process.env.CHATWORK_API_TOKEN
      },
      form: {
        body: message
      },
      json: true,
    };
    request.post(options, (error, response) => {
      if (!error && response.statusCode === 200) {
        resolve();
      } else {
        console.log(`error: ${response.statusCode}`);
        reject();
      }
    });
  });
};

module.exports = {
  buildDlqInfoMessage,
  sendMessageToChatwork,
};
