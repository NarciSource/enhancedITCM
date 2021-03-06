// ==UserScript==
// @name         enhancedITCM
// @namespace    etcm
// @version      0.1.11.2
// @description  EnhancedITCM is a user script that enhances the http://itcm.co.kr/
// @author       narci <jwch11@gmail.com>
// @match        *://itcm.co.kr/*
// @icon         https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/icon.png
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min.js
// @require      https://raw.githubusercontent.com/NarciSource/steamCb.js/master/src/exchange.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.8.0/jquery.contextMenu.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.1/js/jquery.tablesorter.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/locale/ko.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.23/moment-timezone-with-data.min.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/vendor/TimeCircles.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/vendor/flipclock.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/vendor/GreasemonkeyCompatibility.js
// @require      https://raw.githubusercontent.com/NarciSource/steamCb.js/master/src/tablesorter.js
// @resource     etcm-logo https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/logo.png
// @resource     etcm-dark-logo https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/logo-dark.png
// @resource     etcm-dft-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/default.css
// @resource     etcm-drk-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/dark.css
// @resource     etcm-set-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/settings.css
// @resource     etcm-tgg-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/toggleSwitch.css
// @resource     etcm-bmk-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/bookmark.css
// @resource     etcm-tcr-style https://cdnjs.cloudflare.com/ajax/libs/timecircles/1.5.3/TimeCircles.min.css
// @resource     etcm-flc-style https://github.com/objectivehtml/FlipClock/raw/master/compiled/flipclock.css
// @resource     etcm-cmn-style https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.8.0/jquery.contextMenu.min.css
// @resource     etcm-set-layout https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/html/settings.html
// @updateURL    https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/enhancedITCM.meta.js
// @downloadURL  https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/enhancedITCM.user.js
// @grant        GM.getResourceUrl
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      store.steampowered.com
// @connect      steamcommunity.com
// @connect      crowbar.steamstat.us
// @run-at       document-start
// @license      MIT
// ==/UserScript==