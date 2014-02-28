/*global require: false, exports: false */
/*jslint indent: 2 */

(function () {
  "use strict";

  var urlbarButton = require('urlbarbutton').UrlbarButton,
    showForPage = require('showforpage').ShowForPage,
    tabs = require('sdk/tabs'),
    buttonImage = require("sdk/self").data.url("coins.png"),
    button,
    listeners,
    checkLocation,
    checkNewLink;

  checkLocation = function (href, domReady) {
    button.setVisibility(false, href);

    if (href.indexOf('http') === 0 && domReady) {
      var links = this.querySelectorAll('link[rel~="payment"]');

      if (links[0] && links[0].href) {
        button.setOptions({
          show : true,
          gotoUrl : links[0].href,
          tooltip : links[0].title || 'Go to payment'
        }, href);
      }
    }
  };

  checkNewLink = function (href, data, inBackground) {
    if (!inBackground && data.rels.payment && button.getVisibility() === false) {
      button.setOptions({
        show : true,
        gotoUrl : data.href,
        tooltip : data.title || 'Go to payment'
      }, href);
    }
  };

  exports.main = function () {
    button = urlbarButton({
      id : 'relpayment-button',
      image : buttonImage
    });

    listeners = showForPage({
      onLocationChange : checkLocation,
      onLink : checkNewLink
    });
  };

  exports.onUnload = function (reason) {
    if (reason !== 'shutdown') {
      button.remove();
      listeners.remove();
    }
  };
}());
