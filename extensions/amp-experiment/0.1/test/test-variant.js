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

<<<<<<< HEAD
import {allocateVariant} from '../variant';

describe('allocateVariant', () => {

  let fakeWin;
=======
import * as sinon from 'sinon';
import {allocateVariant} from '../variant';
import {stubService} from '../../../../testing/test-helper';

describe('allocateVariant', () => {

  let sandbox;
  let fakeWin;
  let getCidStub;
  let uniformStub;
  let getParamStub;
  let getNotificationStub;
>>>>>>> ampproject/master

  beforeEach(() => {
    fakeWin = {
      Math: {
        random: () => {
          return 0.567;
        },
      },
    };
<<<<<<< HEAD
=======

    sandbox = sinon.sandbox.create();
    getCidStub = stubService(sandbox, fakeWin, 'cid', 'get');
    uniformStub = stubService(sandbox, fakeWin, 'crypto', 'uniform');
    getParamStub = stubService(sandbox, fakeWin, 'viewer', 'getParam');
    getNotificationStub = stubService(
        sandbox, fakeWin, 'userNotificationManager', 'getNotification');
  });

  afterEach(() => {
    sandbox.restore();
>>>>>>> ampproject/master
  });

  it('should throw for invalid config', () => {
    expect(() => {
<<<<<<< HEAD
      allocateVariant(fakeWin, null);
    }).to.throw();

    expect(() => {
      allocateVariant(fakeWin, undefined);
    }).to.throw();

    expect(() => {
      allocateVariant(fakeWin, {});
    }).to.throw(/Missing experiment variants config/);

    expect(() => {
      allocateVariant(fakeWin, {variants: {}});
    }).to.throw(/Missing experiment variants config/);

    expect(() => {
      allocateVariant(fakeWin, {
=======
      allocateVariant(fakeWin, 'name', null);
    }).to.throw();

    expect(() => {
      allocateVariant(fakeWin, 'name', undefined);
    }).to.throw();

    expect(() => {
      allocateVariant(fakeWin, 'name', {});
    }).to.throw(/Missing experiment variants config/);

    expect(() => {
      allocateVariant(fakeWin, 'name', {variants: {}});
    }).to.throw(/Missing experiment variants config/);

    expect(() => {
      allocateVariant(fakeWin, 'name', {
>>>>>>> ampproject/master
        variants: {
          'invalid_char_%_in_name': 1,
        },
      });
<<<<<<< HEAD
    }).to.throw(/Invalid variant name/);

    expect(() => {
      allocateVariant(fakeWin, {
=======
    }).to.throw(/Invalid name/);

    expect(() => {
      allocateVariant(fakeWin, 'name', {
>>>>>>> ampproject/master
        variants: {
          'variant_1': 50,
          'variant_2': 51,
        },
      });
    }).to.throw(/Total percentage is bigger than 100/);

    expect(() => {
<<<<<<< HEAD
      allocateVariant(fakeWin, {
=======
      allocateVariant(fakeWin, 'name', {
>>>>>>> ampproject/master
        variants: {
          'negative_percentage': -1,
        },
      });
    }).to.throw(/Invalid percentage/);

    expect(() => {
<<<<<<< HEAD
      allocateVariant(fakeWin, {
=======
      allocateVariant(fakeWin, 'name', {
>>>>>>> ampproject/master
        variants: {
          'too_big_percentage': 101,
        },
      });
    }).to.throw(/Invalid percentage/);

    expect(() => {
<<<<<<< HEAD
      allocateVariant(fakeWin, {
=======
      allocateVariant(fakeWin, 'name', {
>>>>>>> ampproject/master
        variants: {
          'non_number_percentage': '50',
        },
      });
    }).to.throw(/Invalid percentage/);
<<<<<<< HEAD
=======

    expect(() => {
      allocateVariant(fakeWin, 'invalid_name!', {
        variants: {
          'variant_1': 50,
        },
      });
    }).to.throw(/Invalid name/);

    expect(() => {
      allocateVariant(fakeWin, '', {
        variants: {
          'variant_1': 50,
        },
      });
    }).to.throw(/Invalid name/);

    expect(() => {
      allocateVariant(fakeWin, 'name', {
        group: 'invalid_group_name!',
        variants: {
          'variant_1': 50,
        },
      });
    }).to.throw(/Invalid name/);
>>>>>>> ampproject/master
  });

  it('should work around float rounding error', () => {
    expect(() => {
<<<<<<< HEAD
      allocateVariant(fakeWin, {
=======
      allocateVariant(fakeWin, 'name', {
>>>>>>> ampproject/master
        variants: {
          'a': 50.1,
          'b': 40.3,
          'c': 9.2,
          'd': 0.4,
          // They add up to 100.00000000000001​​​ in JS
        },
      });
    }).to.not.throw();
  });

<<<<<<< HEAD
  it('without CID scope, succeed with a variant allocated', () => {
    return expect(allocateVariant(fakeWin, {
      cidScope: null,
=======
  it('should work in non-sticky mode', () => {
    return expect(allocateVariant(fakeWin, 'name', {
      sticky: false,
>>>>>>> ampproject/master
      variants: {
        '-Variant_1': 56.1,
        '-Variant_2': 23.3,
      },
    })).to.eventually.equal('-Variant_2');
  });

  it('should allocate variant in name order', () => {
<<<<<<< HEAD
    return expect(allocateVariant(fakeWin, {
      cidScope: null,
=======
    return expect(allocateVariant(fakeWin, 'name', {
      sticky: false,
>>>>>>> ampproject/master
      variants: {
        '-Variant_2': 50,
        '-Variant_1': 50,
      },
    })).to.eventually.equal('-Variant_2');
  });

  it('can have no variant allocated if variants don\'t add up to 100', () => {
<<<<<<< HEAD
    return expect(allocateVariant(fakeWin, {
      cidScope: null,
=======
    return expect(allocateVariant(fakeWin, 'name', {
      sticky: false,
>>>>>>> ampproject/master
      variants: {
        '-Variant_1': 2.1,
        '-Variant_2': 23.3,
        '-Variant_3': 20.123,
      },
    })).to.eventually.equal(null);
  });
<<<<<<< HEAD
=======

  it('allow variant override from URL fragment', () => {
    getParamStub.withArgs('amp-x-Name').returns('-Variant_1');
    return expect(allocateVariant(fakeWin, 'Name', {
      sticky: false,
      variants: {
        '-Variant_1': 50,
        '-Variant_2': 50,
      },
    })).to.eventually.equal('-Variant_1');
  });

  it('variant override should ignore non-existed variant name', () => {
    getParamStub.withArgs('amp-x-name').returns('-Variant_3');
    return expect(allocateVariant(fakeWin, 'name', {
      sticky: false,
      variants: {
        '-Variant_1': 50,
        '-Variant_2': 50,
      },
    })).to.eventually.equal('-Variant_2');
  });

  it('should work in sticky mode with default CID scope', () => {
    getCidStub.withArgs({
      scope: 'amp-experiment',
      createCookieIfNotPresent: true,
    }).returns(Promise.resolve('123abc'));
    uniformStub.withArgs('name:123abc').returns(Promise.resolve(0.4));
    return expect(allocateVariant(fakeWin, 'name', {
      variants: {
        '-Variant_1': 50,
        '-Variant_2': 50,
      },
    })).to.eventually.equal('-Variant_1');
  });

  it('should work in sticky mode with custom CID scope', () => {
    getCidStub.withArgs({
      scope: 'custom-scope',
      createCookieIfNotPresent: true,
    }).returns(Promise.resolve('123abc'));
    uniformStub.withArgs('name:123abc').returns(Promise.resolve(0.4));
    return expect(allocateVariant(fakeWin, 'name', {
      cidScope: 'custom-scope',
      variants: {
        '-Variant_1': 50,
        '-Variant_2': 50,
      },
    })).to.eventually.equal('-Variant_1');
  });

  it('should work in sticky mode with custom group', () => {
    getCidStub.withArgs({
      scope: 'amp-experiment',
      createCookieIfNotPresent: true,
    }).returns(Promise.resolve('123abc'));
    uniformStub.withArgs('custom-group:123abc').returns(Promise.resolve(0.4));
    return expect(allocateVariant(fakeWin, 'name', {
      group: 'custom-group',
      variants: {
        '-Variant_1': 50,
        '-Variant_2': 50,
      },
    })).to.eventually.equal('-Variant_1');
  });

  it('should have variant allocated if consent is given', () => {
    getNotificationStub.withArgs('notif-1')
        .returns(Promise.resolve({
          isDismissed: () => {
            return (Promise.resolve(true));
          },
        }));

    getCidStub.withArgs({
      scope: 'amp-experiment',
      createCookieIfNotPresent: true,
    }).returns(Promise.resolve('123abc'));
    uniformStub.withArgs('name:123abc').returns(Promise.resolve(0.4));
    return expect(allocateVariant(fakeWin, 'name', {
      consentNotificationId: 'notif-1',
      variants: {
        '-Variant_1': 50,
        '-Variant_2': 50,
      },
    })).to.eventually.equal('-Variant_1');
  });

  it('should have no variant allocated if notification not found', () => {
    getNotificationStub.withArgs('notif-1')
        .returns(Promise.resolve(null));

    return expect(allocateVariant(fakeWin, 'name', {
      consentNotificationId: 'notif-1',
      variants: {
        '-Variant_1': 50,
        '-Variant_2': 50,
      },
    })).to.eventually.rejectedWith('Notification not found: notif-1');
  });

  it('should have no variant allocated if consent is missing', () => {
    getNotificationStub.withArgs('notif-1')
        .returns(Promise.resolve({
          isDismissed: () => {
            return (Promise.resolve(false));
          },
        }));

    getCidStub.returns(Promise.resolve('123abc'));
    uniformStub.returns(Promise.resolve(0.4));
    return expect(allocateVariant(fakeWin, 'name', {
      consentNotificationId: 'notif-1',
      variants: {
        '-Variant_1': 50,
        '-Variant_2': 50,
      },
    })).to.eventually.equal(null);
  });
>>>>>>> ampproject/master
});
