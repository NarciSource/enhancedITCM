// ==UserScript==
// @name         enhancedITCM
// @namespace    etcm
// @version      0.1.16.20
// @description  EnhancedITCM is a user script that enhances the https://itcm.co.kr/
// @author       narci
// @match        *://itcm.co.kr/*
// @icon         https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/icon.png
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min.js
// @require      https://unpkg.com/vue@3
// @require      https://cdnjs.cloudflare.com/ajax/libs/fast-xml-parser/4.0.12/fxparser.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.8.0/jquery.contextMenu.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.1/js/jquery.tablesorter.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jQuery-Flip/1.1.2/jquery.flip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/locale/ko.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.23/moment-timezone-with-data.min.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/vendor/TimeCircles.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/vendor/flipclock.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/vendor/GreasemonkeyCompatibility.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/js/meta.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/js/utility.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/js/module.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/js/module_upgrade.js
// @resource     side.html https://narcisource.github.io/enhancedITCM/html/side.html
// @resource     bookmark.html https://narcisource.github.io/enhancedITCM/html/bookmark.html
// @resource     settings.html https://narcisource.github.io/enhancedITCM/html/settings.html
// @resource     miniprofile.html https://narcisource.github.io/enhancedITCM/html/miniprofile.html
// @resource     tab.html https://narcisource.github.io/enhancedITCM/html/tab.html
// @resource     article.html https://narcisource.github.io/enhancedITCM/html/article.html
// @resource     default.css https://narcisource.github.io/enhancedITCM/css/default.css
// @resource     dark.css https://narcisource.github.io/enhancedITCM/css/dark.css
// @resource     side.css https://narcisource.github.io/enhancedITCM/css/side.css
// @resource     bookmark.css https://narcisource.github.io/enhancedITCM/css/bookmark.css
// @resource     tablesorter.css https://narcisource.github.io/enhancedITCM/css/tablesorter.css
// @resource     settings.css https://narcisource.github.io/enhancedITCM/css/settings.css
// @resource     etcm-logo https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/logo.png
// @resource     etcm-dark-logo https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/logo-dark.png
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
// @run-at       document-start
// @license      MIT
// ==/UserScript==