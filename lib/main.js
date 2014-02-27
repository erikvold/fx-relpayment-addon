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
    checkLinks,
    checkLocation,
    checkNewLink,
    clickAction;

  checkLinks = function (doc, callback) {
    var links = doc.querySelectorAll('link[rel~="payment"]');

    callback(links[0] ? links[0].href : false);
  };

  checkLocation = function (href, domReady) {
    button.setVisibility(false, href);

    if (href.indexOf('http') === 0 && domReady) {
      checkLinks(this, function (url) {
        if (url) {
          button.setVisibility(true, href);
        }
      });
    }
  };

  checkNewLink = function (href, data, inBackground) {
    if (!inBackground && data.rels.payment && button.getVisibility() === false) {
      button.setVisibility(true, href);
    }
  };

  clickAction = function (href, event) {
    if (event.type !== "click" || event.button !== 0) {
      return;
    }

    checkLinks(this, function (url) {
      if (url) {
        tabs.open(url);
      }
    });
  };

  exports.main = function () {
    button = urlbarButton({
      id : 'relpayment-button',
      image : buttonImage,
      onClick : clickAction,
      tooltip : 'Go to payment'
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
