/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
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

import {Timer} from '../../../../src/timer';
import {createIframePromise} from '../../../../testing/iframe';
require('../amp-image-lightbox');
import {
  ImageViewer,
} from '../amp-image-lightbox';
import {adopt} from '../../../../src/runtime';
import {parseSrcset} from '../../../../src/srcset';
import * as sinon from 'sinon';

adopt(window);


describe('amp-image-lightbox component', () => {

  function getImageLightbox() {
    return createIframePromise().then(iframe => {
      const el = iframe.doc.createElement('amp-image-lightbox');
      el.setAttribute('layout', 'nodisplay');
      iframe.doc.body.appendChild(el);
      return new Timer(window).promise(16).then(() => {
        el.implementation_.buildCallback();
        return el;
      });
    });
  }

  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render correctly', () => {
    return getImageLightbox().then(lightbox => {
      const container = lightbox
          .querySelector('.-amp-image-lightbox-container');
      expect(container).to.not.equal(null);

      const caption = container.querySelector('.-amp-image-lightbox-caption');
      expect(caption).to.not.equal(null);
      expect(caption).to.have.class('amp-image-lightbox-caption');

      const viewer = container.querySelector('.-amp-image-lightbox-viewer');
      expect(viewer).to.not.equal(null);

      const image = viewer.querySelector('.-amp-image-lightbox-viewer-image');
      expect(image).to.not.equal(null);

      // Very important. Image must have transform-origin=50% 50%.
      const win = image.ownerDocument.defaultView;
      expect(win.getComputedStyle(image)['transform-origin']).to.equal(
          '50% 50%');
    });
  });

  it('should activate all steps', () => {
    return getImageLightbox().then(lightbox => {
      const impl = lightbox.implementation_;
      const requestFullOverlay = sandbox.spy();
      impl.requestFullOverlay = requestFullOverlay;
      const viewportOnChanged = sandbox.spy();
      const disableTouchZoom = sandbox.spy();
      const hideFixedLayer = sandbox.spy();
      const showFixedLayer = sandbox.spy();
      impl.getViewport = () => {return {
        onChanged: viewportOnChanged,
        disableTouchZoom: disableTouchZoom,
        hideFixedLayer: hideFixedLayer,
        showFixedLayer: showFixedLayer,
      };};
      const historyPush = sandbox.spy();
      impl.getHistory_ = () => {
        return {push: () => {
          historyPush();
          return Promise.resolve(11);
        }};
      };
      const enter = sandbox.spy();
      impl.enter_ = enter;

      const ampImage = document.createElement('amp-img');
      ampImage.setAttribute('src', 'data:');
      impl.activate({source: ampImage});

      expect(requestFullOverlay.callCount).to.equal(1);
      expect(viewportOnChanged.callCount).to.equal(1);
      expect(impl.unlistenViewport_).to.not.equal(null);
      expect(historyPush.callCount).to.equal(1);
      expect(enter.callCount).to.equal(1);
      expect(impl.sourceElement_).to.equal(ampImage);
      expect(disableTouchZoom.callCount).to.equal(1);
      expect(hideFixedLayer.callCount).to.equal(1);
      expect(showFixedLayer.callCount).to.equal(0);
    });
  });

  it('should deactivate all steps', () => {
    return getImageLightbox().then(lightbox => {
      const impl = lightbox.implementation_;
      impl.active_ = true;
      impl.historyId_ = 11;
      const cancelFullOverlay = sandbox.spy();
      impl.cancelFullOverlay = cancelFullOverlay;
      const viewportOnChangedUnsubscribed = sandbox.spy();
      impl.unlistenViewport_ = viewportOnChangedUnsubscribed;
      const restoreOriginalTouchZoom = sandbox.spy();
      const hideFixedLayer = sandbox.spy();
      const showFixedLayer = sandbox.spy();
      impl.getViewport = () => {return {
        restoreOriginalTouchZoom: restoreOriginalTouchZoom,
        hideFixedLayer: hideFixedLayer,
        showFixedLayer: showFixedLayer,
      };};
      const historyPop = sandbox.spy();
      impl.getHistory_ = () => {
        return {pop: historyPop};
      };
      const exit = sandbox.spy();
      impl.exit_ = exit;

      const ampImage = document.createElement('amp-img');
      ampImage.setAttribute('src', 'data:');
      impl.close();

      expect(impl.active_).to.equal(false);
      expect(exit.callCount).to.equal(1);
      expect(viewportOnChangedUnsubscribed.callCount).to.equal(1);
      expect(impl.unlistenViewport_).to.equal(null);
      expect(cancelFullOverlay.callCount).to.equal(1);
      expect(restoreOriginalTouchZoom.callCount).to.equal(1);
      expect(historyPop.callCount).to.equal(1);
      expect(showFixedLayer.callCount).to.equal(1);
      expect(hideFixedLayer.callCount).to.equal(0);
    });
  });

  it('should close on ESC', () => {
    return getImageLightbox().then(lightbox => {
      const impl = lightbox.implementation_;
      const setupCloseSpy = sandbox.spy(impl, 'close');
      const viewportOnChanged = sandbox.spy();
      const disableTouchZoom = sandbox.spy();
      const restoreOriginalTouchZoom = sandbox.spy();
      impl.getViewport = () => {return {
        onChanged: viewportOnChanged,
        disableTouchZoom: disableTouchZoom,
        restoreOriginalTouchZoom: restoreOriginalTouchZoom,
        hideFixedLayer: () => {},
        showFixedLayer: () => {},
      };};
      const historyPush = sandbox.spy();
      impl.getHistory_ = () => {
        return {push: () => {
          historyPush();
          return Promise.resolve(11);
        }};
      };
      const enter = sandbox.spy();
      impl.enter_ = enter;

      const ampImage = document.createElement('amp-img');
      ampImage.setAttribute('src', 'data:');
      ampImage.setAttribute('width', '100');
      ampImage.setAttribute('height', '100');
      impl.activate({source: ampImage});
      impl.closeOnEscape_({keyCode: 27});
      expect(setupCloseSpy.callCount).to.equal(1);
    });
  });
});


describe('amp-image-lightbox image viewer', () => {

  let sandbox;
  let clock;
  let lightbox;
  let lightboxMock;
  let imageViewer;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers();

    lightbox = {
      getDpr: () => 1,
      element: {
        ownerDocument: document,
      },
    };
    lightboxMock = sandbox.mock(lightbox);

    imageViewer = new ImageViewer(lightbox);
    document.body.appendChild(imageViewer.getElement());
  });

  afterEach(() => {
    document.body.removeChild(imageViewer.getElement());
    lightboxMock.verify();
    sandbox.restore();
  });


  it('should have 0 initial dimensions', () => {
    expect(imageViewer.getImage().src).to.equal('');
    expect(imageViewer.getViewerBox().width).to.equal(0);
    expect(imageViewer.getImageBox().width).to.equal(0);
    expect(imageViewer.sourceWidth_).to.equal(0);
    expect(imageViewer.sourceHeight_).to.equal(0);
  });


  it('should init to the source element without image', () => {
    const sourceElement = {
      offsetWidth: 101,
      offsetHeight: 201,
      getAttribute: name => {
        if (name == 'src') {
          return 'image1';
        }
        return undefined;
      },
    };

    imageViewer.init(sourceElement, null);

    expect(imageViewer.sourceWidth_).to.equal(101);
    expect(imageViewer.sourceHeight_).to.equal(201);
    expect(imageViewer.srcset_.getLast().url).to.equal('image1');
    expect(imageViewer.getImage().src).to.equal('');
  });

  it('should init to the source element with unloaded image', () => {
    const sourceElement = {
      offsetWidth: 101,
      offsetHeight: 201,
      getAttribute: name => {
        if (name == 'src') {
          return 'image1';
        }
        return undefined;
      },
    };
    const sourceImage = {
      complete: false,
      src: 'image1-smaller',
    };

    imageViewer.init(sourceElement, sourceImage);

    expect(imageViewer.getImage().src).to.equal('');
  });

  it('should init to the source element with loaded image', () => {
    const sourceElement = {
      offsetWidth: 101,
      offsetHeight: 201,
      getAttribute: name => {
        if (name == 'src') {
          return 'image1';
        }
        return undefined;
      },
    };
    const sourceImage = {
      complete: true,
      src: 'image1-smaller',
    };

    imageViewer.init(sourceElement, sourceImage);

    expect(imageViewer.getImage().getAttribute('src')).to
        .equal('image1-smaller');
  });

  it('should reset', () => {
    imageViewer.sourceWidth_ = 101;
    imageViewer.sourceHeight_ = 201;
    imageViewer.getImage().setAttribute('src', 'image1');

    imageViewer.reset();

    expect(imageViewer.sourceWidth_).to.equal(0);
    expect(imageViewer.sourceHeight_).to.equal(0);
    expect(imageViewer.getImage().getAttribute('src')).to.equal('');
    expect(imageViewer.srcset_).to.equal(null);
    expect(imageViewer.imageBox_.width).to.equal(0);
  });


  it('should measure horiz aspect ratio and assign image.src', () => {
    imageViewer.getElement().style.width = '100px';
    imageViewer.getElement().style.height = '200px';
    imageViewer.srcset_ = parseSrcset('image1');
    imageViewer.sourceWidth_ = 80;
    imageViewer.sourceHeight_ = 60;

    const promise = imageViewer.measure();

    expect(imageViewer.viewerBox_.width).to.equal(100);
    expect(imageViewer.viewerBox_.height).to.equal(200);

    expect(imageViewer.imageBox_.width).to.equal(100);
    expect(imageViewer.imageBox_.height).to.equal(75);
    expect(imageViewer.imageBox_.left).to.equal(0);
    expect(imageViewer.imageBox_.top).to.be.closeTo(62.5, 1);

    expect(imageViewer.getImage().style.left).to.equal('0px');
    expect(imageViewer.getImage().style.top).to.equal('63px');
    expect(imageViewer.getImage().style.width).to.equal('100px');
    expect(imageViewer.getImage().style.height).to.equal('75px');

    clock.tick(10);
    const checkSrc = () => {
      expect(imageViewer.getImage().getAttribute('src')).to.equal('image1');
    };
    return promise.then(checkSrc, checkSrc);
  });

  it('should measure vert aspect ratio but small height', () => {
    imageViewer.getElement().style.width = '100px';
    imageViewer.getElement().style.height = '200px';
    imageViewer.srcset_ = parseSrcset('image1');
    imageViewer.sourceWidth_ = 80;
    imageViewer.sourceHeight_ = 120;

    imageViewer.measure();
    expect(imageViewer.imageBox_.width).to.equal(100);
    expect(imageViewer.imageBox_.height).to.equal(150);
    expect(imageViewer.imageBox_.left).to.equal(0);
    expect(imageViewer.imageBox_.top).to.be.closeTo(25, 1);
  });

  it('should measure vert aspect ratio but high height', () => {
    imageViewer.getElement().style.width = '100px';
    imageViewer.getElement().style.height = '200px';
    imageViewer.srcset_ = parseSrcset('image1');
    imageViewer.sourceWidth_ = 40;
    imageViewer.sourceHeight_ = 100;

    imageViewer.measure();
    expect(imageViewer.imageBox_.width).to.be.closeTo(80, 1);
    expect(imageViewer.imageBox_.height).to.equal(200);
    expect(imageViewer.imageBox_.left).to.be.closeTo(10, 1);
    expect(imageViewer.imageBox_.top).to.equal(0);
  });
});


describe('amp-image-lightbox image viewer gestures', () => {

  let sandbox;
  let lightbox;
  let lightboxMock;
  let imageViewer;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    lightbox = {
      getDpr: () => 1,
      close: () => {},
      toggleViewMode: () => {},
      element: {
        ownerDocument: document,
      },
    };
    lightboxMock = sandbox.mock(lightbox);

    imageViewer = new ImageViewer(lightbox);
    document.body.appendChild(imageViewer.getElement());

    imageViewer.getElement().style.width = '100px';
    imageViewer.getElement().style.height = '200px';
    imageViewer.srcset_ = parseSrcset('image1');
    imageViewer.sourceWidth_ = 100;
    imageViewer.sourceHeight_ = 80;
    imageViewer.measure();
  });

  afterEach(() => {
    document.body.removeChild(imageViewer.getElement());
    lightboxMock.verify();
    sandbox.restore();
  });

  it('should have initial bounds', () => {
    expect(imageViewer.minX_).to.equal(0);
    expect(imageViewer.maxX_).to.equal(0);
    expect(imageViewer.minY_).to.equal(0);
    expect(imageViewer.maxY_).to.equal(0);
  });

  it('should update bounds but fits Y-axis', () => {
    imageViewer.updatePanZoomBounds_(2);
    expect(imageViewer.minX_).to.equal(-50);
    expect(imageViewer.maxX_).to.equal(50);
    expect(imageViewer.minY_).to.equal(0);
    expect(imageViewer.maxY_).to.equal(0);
  });

  it('should update bounds and covers both axis', () => {
    imageViewer.updatePanZoomBounds_(3);
    expect(imageViewer.minX_).to.equal(-100);
    expect(imageViewer.maxX_).to.equal(100);
    expect(imageViewer.minY_).to.equal(-20);
    expect(imageViewer.maxY_).to.equal(20);
  });


  it('should pan on swipe', () => {
    imageViewer.updatePanZoomBounds_(2);
    imageViewer.onMove_(-25, -25, false);

    // X is within the bounds and Y is within the extent.
    expect(imageViewer.posX_).to.equal(-25);
    expect(imageViewer.posY_).to.equal(-25);

    // Start X/Y don't change until release
    expect(imageViewer.startX_).to.equal(0);
    expect(imageViewer.startY_).to.equal(0);
  });

  it('should correct pan on swipe within bounds', () => {
    imageViewer.updatePanZoomBounds_(2);
    imageViewer.onMove_(-100, -100, false);

    // X and Y are constrained by the bounds.
    expect(imageViewer.posX_).to.equal(-50);
    expect(imageViewer.posY_).to.equal(-50);
  });

  it('should cancel lightbox when pulled down at scale = 1', () => {
    lightboxMock.expects('close').once();
    imageViewer.onMove_(0, -100, false);
    imageViewer.onMoveRelease_(0, 0.5);
  });


  it('should zoom step', () => {
    imageViewer.onZoomInc_(10, 10, -10, -10);

    expect(imageViewer.posX_).to.be.closeTo(6.5, 1e-1);
    expect(imageViewer.posY_).to.equal(0);
    expect(imageViewer.scale_).to.be.closeTo(1.1, 1e-1);

    // Start X/Y/scale don't change until release
    expect(imageViewer.startX_).to.equal(0);
    expect(imageViewer.startY_).to.equal(0);
    expect(imageViewer.startScale_).to.equal(1);
  });

  it('should zoom release', () => {
    const updateSrc = sandbox.spy();
    imageViewer.updateSrc_ = updateSrc;
    imageViewer.onZoomInc_(10, 10, -10, -10);
    return imageViewer.onZoomRelease_(10, 10, -10, -10, 0, 0).then(() => {
      expect(updateSrc.callCount).to.equal(1);
      expect(imageViewer.posX_).to.be.closeTo(6.5, 1e-1);
      expect(imageViewer.startX_).to.be.closeTo(6.5, 1e-1);
      expect(imageViewer.posY_).to.equal(0);
      expect(imageViewer.startY_).to.equal(0);
      expect(imageViewer.scale_).to.be.closeTo(1.1, 1e-1);
      expect(imageViewer.startScale_).to.be.closeTo(1.1, 1e-1);
    });
  });
});
