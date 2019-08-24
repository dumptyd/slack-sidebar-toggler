// ==UserScript==
// @name         Slack Sidebar Toggler
// @description  Adds the ability to toggle the main sidebar on Slack Web using a keyboard shortcut (ctrl + alt + B)
// @author       dumptyd (http://github.com/dumptyd)
// @version      1.0.0
// @namespace    http://github.com/dumptyd
// @match        https://app.slack.com/client/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  'use strict';

  const combinator = {
    on: function(passedCombination, callback) {
      const combination = passedCombination.map(c => c.toLowerCase());
      let buffer = [];
      let skipNextKeyUp = false;

      const isCombinationMet = () => buffer.toString() === combination.toString();

      document.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();
        buffer.push(key);

        if (isCombinationMet()) {
          buffer.pop();
          if (buffer.length) skipNextKeyUp = true;

          callback();
        }
      });

      document.addEventListener('keyup', e => {
        if (skipNextKeyUp) {
          skipNextKeyUp = false;
          return;
        }
        buffer = [];
      });
    }
  };

  const onLoad = callback => {
    const loadedStates = ['loaded', 'interactive', 'complete'];
    if (loadedStates.includes(document.readyState)) {
      callback();
    }
    else {
      window.addEventListener('load', () => {
        callback();
      });
    }
  };

  const style = {
    leftSidebarCollapsedClassName: 'SST-left-sidebar-collapsed',
    leftSidebarWidth: '220px',
    gridSelector: '.p-workspace'
  };
  GM_addStyle(`
    .${style.leftSidebarCollapsedClassName} ${style.gridSelector} {
      width: calc(100vw + ${style.leftSidebarWidth});
      transform: translate(-${style.leftSidebarWidth});
    }
    ${style.gridSelector} {
      transition: .2s transform;
    }
  `);

  onLoad(() => {
    combinator.on(['Control', 'Alt', 'B'], () => {
      document.body.classList.toggle(style.leftSidebarCollapsedClassName);
    });
  });
})();
