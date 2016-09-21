/**
 * Copyright 2016 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Crypto} from '../crypto-impl';
<<<<<<< HEAD
import {Platform} from '../../../../src/platform';
=======
import {Platform} from '../../../../src/service/platform-impl';
>>>>>>> ampproject/master
import * as lib from '../../../../third_party/closure-library/sha384-generated';
import * as sinon from 'sinon';

describe('crypto-impl', () => {

<<<<<<< HEAD
=======
  let sandbox;

  function uint8Array(array) {
    const uint8Array = new Uint8Array(array.length);
    for (let i = 0; i < array.length; i++) {
      uint8Array[i] = array[i];
    }
    return uint8Array;
  }

>>>>>>> ampproject/master
  function testSuite(descption, crypto) {
    describe(descption, () => {
      it('should hash "abc" in sha384', () => {
        return crypto.sha384('abc').then(buffer => {
          expect(buffer.length).to.equal(48);
          expect(buffer[0]).to.equal(203);
          expect(buffer[1]).to.equal(0);
          expect(buffer[47]).to.equal(167);
        });
      });

<<<<<<< HEAD
=======
      it('should hash [1,2,3] in sha384', () => {
        return crypto.sha384(uint8Array([1,2,3])).then(buffer => {
          expect(buffer.length).to.equal(48);
          expect(buffer[0]).to.equal(134);
          expect(buffer[1]).to.equal(34);
          expect(buffer[47]).to.equal(246);
        });
      });

>>>>>>> ampproject/master
      it('should hash "abc" in sha384Base64', () => {
        return expect(crypto.sha384Base64('abc')).to.eventually.equal(
            'ywB1P0WjXou1oD1pmsZQBycsMqsO3tFjGotgWkP_W-2AhgcroefMI1i67KE0yCWn');
      });

      it('should hash "foobar" in sha384Base64', () => {
        return expect(crypto.sha384Base64('foobar')).to.eventually.equal(
            'PJww2fZl501RXIQpYNSkUcg6ASX9Pec5LXs3IxrxDHLqWK7fzfiaV2W_kCr5Ps8G');
      });

<<<<<<< HEAD
=======
      it('should hash [1,2,3] in sha384', () => {
        return expect(crypto.sha384Base64([1,2,3])).to.eventually.equal(
            'hiKdxtL_vqxzgHRBVKpwApHAZDUqDb3He57T8sjh2sTcMlhn053f8dJim3o5PUf2');
      });

>>>>>>> ampproject/master
      it('should throw when input contains chars out of range [0,255]', () => {
        expect(() => crypto.sha384('abc今')).to.throw();
        expect(() => crypto.sha384Base64('abc今')).to.throw();
        expect(() => crypto.uniform('abc今')).to.throw();
      });

      it('should hash "abc" to uniform number', () => {
        return crypto.uniform('abc').then(result => {
          expect(result.toFixed(6)).to.equal('0.792976');
        });
      });
    });
  }

  function isModernChrome() {
    const platform = new Platform(window);
<<<<<<< HEAD
    return platform.isChrome() && platform.getMajorVersion() >= 45;
  }

=======
    return platform.isChrome() && platform.getMajorVersion() >= 37;
  }

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

>>>>>>> ampproject/master
  testSuite('with native crypto API', new Crypto(window));
  testSuite('with crypto lib', new Crypto({}));
  testSuite('with native crypto API rejects', new Crypto({
    crypto: {
      subtle: {
        digest: () => Promise.reject('Operation not supported'),
      },
    },
  }));
  testSuite('with native crypto API throws', new Crypto({
    crypto: {
      subtle: {
        digest: () => {
          throw new Error();
        },
      },
    },
  }));

  it('native API result should exactly equal to crypto lib result', () => {
    return Promise
        .all([new Crypto(window).sha384('abc'), new Crypto({}).sha384('abc')])
        .then(results => {
          expect(results[0]).to.jsonEqual(results[1]);
        });
  });

<<<<<<< HEAD
  // Run this test only on browsers that we're confident about the existence
  // of native Crypto API.
  if (isModernChrome()) {
    it('should not call closure lib when native API is available', () => {
      const sandbox = sinon.sandbox.create();
=======
  // Run tests below only on browsers that we're confident about the existence
  // of native Crypto API.
  if (isModernChrome()) {
    it('should not call closure lib when native API is available ' +
        '(string input)', () => {
>>>>>>> ampproject/master
      const nativeApiSpy = sandbox.spy(window.crypto.subtle, 'digest');
      const libSpy = sandbox.spy(lib, 'sha384');
      return new Crypto(window).sha384Base64('abc').then(hash => {
        expect(hash).to.equal(
            'ywB1P0WjXou1oD1pmsZQBycsMqsO3tFjGotgWkP_W-2AhgcroefMI1i67KE0yCWn');
        expect(nativeApiSpy).to.have.been.calledOnce;
        expect(libSpy).to.not.have.been.called;
      });
<<<<<<< HEAD
      sandbox.restore();
=======
    });

    it('should not call closure lib when native API is available ' +
        '(Uint8Array input)', () => {
      const nativeApiSpy = sandbox.spy(window.crypto.subtle, 'digest');
      const libSpy = sandbox.spy(lib, 'sha384');
      return new Crypto(window).sha384Base64(uint8Array([1,2,3])).then(hash => {
        expect(hash).to.equal(
            'hiKdxtL_vqxzgHRBVKpwApHAZDUqDb3He57T8sjh2sTcMlhn053f8dJim3o5PUf2');
        expect(nativeApiSpy).to.have.been.calledOnce;
        expect(libSpy).to.not.have.been.called;
      });
>>>>>>> ampproject/master
    });
  }
});
