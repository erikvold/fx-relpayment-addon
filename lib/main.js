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
    checkNewLink,
    showButton,
    MatchPattern = require("sdk/util/match-pattern").MatchPattern,
    highlight = {
      flattr : {
        pattern : new MatchPattern("*.flattr.com"),
        image : require("sdk/self").data.url("coins-flattr.png")
      },
      gittip : {
        pattern : new MatchPattern("*.gittip.com"),
        image : require("sdk/self").data.url("coins-gittip.png")
      }
    };

  showButton = function (href, data) {
    var site, image;

    for (site in highlight) {
      if (highlight.hasOwnProperty(site)) {
        if (highlight[site].pattern.test(data.href)) {
          image = highlight[site].image;
          break;
        }
      }
    }

    button.setOptions({
      show : true,
      gotoUrl : data.href,
      image : image || buttonImage,
      tooltip : data.title || 'Go to payment'
    }, href);
  };

  checkLocation = function (href, domReady) {
    button.setVisibility(false, href);

    if (href.indexOf('http') === 0 && domReady) {
      var links = this.querySelectorAll('link[rel~="payment"]');

      if (links[0] && links[0].href) {
        showButton(href, links[0]);
      }
    }
  };

  checkNewLink = function (href, data, inBackground) {
    if (!inBackground && data.rels.payment && button.getVisibility() === false) {
      showButton(href, data);
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
