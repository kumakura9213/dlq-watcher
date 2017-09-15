'use strict';

require('dotenv').config({ path: './test/.env' });
const assert = require('power-assert');
const { buildDlqInfoMessage, sendMessageToChatwork } = require('./../lib/chatwork.js');


describe('lib/chatwork.js', () => {

  it('buildDlqInfoMessage return DLQ Info(with MessageAttributes Info)', () => {

    const message = {
      MessageId: '6ae780ca-1248-4cf2-8628-bba9dc7a6792',
      ReceiptHandle: 'AQEB7BNFOcX92PsMh9xcfjptpuejH08k74ZI5GlxYAfITBDEMaktmhXNJmzBby9CqmdnwTPw3QvvaUVu1NIEWA+SgzZcH1f2zsUcE4sZ3NPQ26yyQiuvSLOWHkXjyg8L/vzXjdWzZx9HghDgP3CvGQJV1swstxQCs8TED9/fasxpSc/oavjF464RWo3tkCB+si2mbUygDeKojVfo8g1lUBztABs0z6RWi97Bwu2OGSpXNjqsx1Y9qaY0eBNv8H3P1jrvLKZsD1iCYGVrSJUcgF8+ca2IynYWWKmaxO3eea1frqglUbm8HtboX1ytMWsKsvSZWDjx3u9Uvs2Qh+DfnGuraXNgMSdrWsqVXemgenXiiBcBBOKcPx8ACAPono2WnUsGLnnzpbTzDHe3LhqOA5BGiS4VkzgpNqmKeeCx5YLsg/gdL0/SlY9lW6nQBSaOmlSP',
      MD5OfBody: '098f6bcd4621d373cade4e832627b4f6',
      Body: 'Dead Letter Queue Body',
      Attributes: {
        SenderId: 'AIDAI6FYOSHYTBQJ74PXM',
        ApproximateFirstReceiveTimestamp: '1504840164343',
        ApproximateReceiveCount: '1',
        SentTimestamp: '1504840105492'
      },
      MD5OfMessageAttributes: '998fd534e3d92156bb7050b1df5d879c',
      MessageAttributes: {
        name: {
          StringValue: 'kumakura',
          StringListValues: [],
          BinaryListValues: [],
          DataType: 'String'
        },
        age: {
          StringValue: '28',
          StringListValues: [],
          BinaryListValues: [],
          DataType: 'String'
        },
      }
    };

    const expected = '[info][title]dlq-info[/title]発生日時        : 2017-09-08 12:08:25\n'
      + 'メッセージ ID: 6ae780ca-1248-4cf2-8628-bba9dc7a6792\n'
      + '本文               : Dead Letter Queue Body\n'
      + '[hr]name: kumakura\n'
      +  'age: 28[/info]';

    assert(expected === buildDlqInfoMessage(message));
  });

  it('buildDlqInfoMessage return DLQ Info(no MessageAttributes Info)', () => {

    const message = {
      MessageId: '6ae780ca-1248-4cf2-8628-bba9dc7a6792',
      ReceiptHandle: 'AQEB7BNFOcX92PsMh9xcfjptpuejH08k74ZI5GlxYAfITBDEMaktmhXNJmzBby9CqmdnwTPw3QvvaUVu1NIEWA+SgzZcH1f2zsUcE4sZ3NPQ26yyQiuvSLOWHkXjyg8L/vzXjdWzZx9HghDgP3CvGQJV1swstxQCs8TED9/fasxpSc/oavjF464RWo3tkCB+si2mbUygDeKojVfo8g1lUBztABs0z6RWi97Bwu2OGSpXNjqsx1Y9qaY0eBNv8H3P1jrvLKZsD1iCYGVrSJUcgF8+ca2IynYWWKmaxO3eea1frqglUbm8HtboX1ytMWsKsvSZWDjx3u9Uvs2Qh+DfnGuraXNgMSdrWsqVXemgenXiiBcBBOKcPx8ACAPono2WnUsGLnnzpbTzDHe3LhqOA5BGiS4VkzgpNqmKeeCx5YLsg/gdL0/SlY9lW6nQBSaOmlSP',
      MD5OfBody: '098f6bcd4621d373cade4e832627b4f6',
      Body: 'Dead Letter Queue Body',
      Attributes: {
        SenderId: 'AIDAI6FYOSHYTBQJ74PXM',
        ApproximateFirstReceiveTimestamp: '1504840164343',
        ApproximateReceiveCount: '1',
        SentTimestamp: '1504840105492'
      },
      MD5OfMessageAttributes: '998fd534e3d92156bb7050b1df5d879c',
    };

    const expected = '[info][title]dlq-info[/title]発生日時        : 2017-09-08 12:08:25\n'
      + 'メッセージ ID: 6ae780ca-1248-4cf2-8628-bba9dc7a6792\n'
      + '本文               : Dead Letter Queue Body\n'
      +  '[/info]';

    assert(expected === buildDlqInfoMessage(message));
  });

  it('sendMessageToChatwork return Promise', () => {
    assert(sendMessageToChatwork(process.env.CHATWORK_TARGET_ROOM_ID, '(beer)') instanceof Promise);
  });
});
