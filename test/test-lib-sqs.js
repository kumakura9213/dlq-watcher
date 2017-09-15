'use strict';

require('dotenv').config({ path: './test/.env' });
const assert = require('power-assert');
const { receiveMessage, deleteMessage } = require('./../lib/sqs.js');

// TODO aws-sdkは明示的にはinstallしてないから、ガンガン利用するのはためらわれる。
describe('lib/sqs.js', () => {

  it('receiveMessage return Promise', () => {
    assert(receiveMessage() instanceof Promise);
  });
});
