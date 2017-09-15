'use strict';

// eslint-disable-next-line import/no-extraneous-dependencies
const AWS = require('aws-sdk');

const sqs = new AWS.SQS({ region: process.env.SQS_REGION });

/**
 * SQSからメッセージを受信する。
 *
 * @return {Promise} SQSからメッセージを受信するPromise
 */
const receiveMessage = () => {
  return new Promise((resolve, reject) => {
    const params = {
      QueueUrl: process.env.SQS_URL,
      AttributeNames: ['All'],
      MessageAttributeNames: ['All'],
      MaxNumberOfMessages: 10,
    };

    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        reject();
      } else if (!Object.hasOwnProperty.call(data, 'Messages')) {
        // 返却されたデータオブジェクトが'Messages'を持っていない場合、
        // メッセージがないので空の配列を返却する。
        resolve([]);
      } else {
        resolve(data.Messages);
      }
    });
  });
};

/**
 * SQSからメッセージを削除する。
 *
 * @param {String} receiptHandle ReceiptHandle
 * @return {Promise} SQSにメッセージを送信するPromise
 */
const deleteMessage = (receiptHandle) => {
  return new Promise((resolve, reject) => {
    const params = {
      QueueUrl: process.env.SQS_URL,
      ReceiptHandle: receiptHandle,
    };
    sqs.deleteMessage(params, (err) => {
      if (err) {
        console.log(err, err.stack);
        reject();
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  receiveMessage,
  deleteMessage,
};
