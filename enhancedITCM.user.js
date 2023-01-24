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

console.info(`

                       $$                                                                                                      
                    $$$$$$$$                                                                                                   
                 $$$$$$$$$$$$$$                      ♪♫•*̈*•.̧ ̧ .•*̈*•♫♪                                                          
              $$$$$$$$$  $$$$$$$$$$                 ♪ღ♪               ++                                            ++#        
         $$$$$$$$$$          $$$$$$$$$$            *•♪~ღ.̧ ̧  g +o+h+  e+lo+lo   +-b-+   +w+o+r+  +l+  o+d7+     -++ ++#         
         $$$$$$$$$             $$$$$$$$$          ♪ღ♪      +++ o++  +++ 7+++ ++  n+   +++ +++ ++     ++~ + +  +8  ++o          
      @@@   $$$$$$$$$       $$$$$$$$$   ++       https:// git hub .com /Nar  ci So u rce /en  hancd  ITCM/+    #+++o           
      @@@@@@@  $$$$$$$$$$$$$$$$$$   ++++++                                                                                     
      @@@@@@@@@@   $$$$$$$$$$    +++++++++        EEEEE   EEEEEEEEEEEEEEEEE   EEEEEEEEEEEEEEE  EEEEEEEEE        EEEEEEEE       
      @@@@@@@@@@@@@   $$$$   +++++++++            EEEEE   EEEEEEEEEEEEEEEEE  EEEEEEEEEEEEEEEE  EEEEEEEEE        EEEEEEEE       
      @@@@@   @@@@@@@@@  +++++++++                EEEEE         EEEEE        EEEEEE            EEEEEEEEEE      EEEEEEEEE       
      @@@@@      @@@@@@  ++++++         ++        EEEEE         EEEEE        EEEEEE            EEEEEEEEEEE     EEEEEEEEE       
      @@@@@         @@@  ++++         ++++        EEEEE         EEEEE        EEEEEE            EEEEEEEEEEE    EEEEEEEEEE       
      @@@@@              ++++         ++++        EEEEE         EEEEE        EEEEEE            EEEEEE EEEEE  EEEEE EEEEE       
      @@@@@@@            ++++      +++++++        EEEEE         EEEEE        EEEEEE            EEEEEE  EEEEEEEEEEE EEEEE       
        @@@@@@@@         ++++   +++++++++         EEEEE         EEEEE        EEEEEE            EEEEEE  EEEEEEEEEE  EEEEE       
            @@@@@@@@     ++++++++++++             EEEEE         EEEEE        EEEEEEEEEEEEEEEE  EEEEEE   EEEEEEEE   EEEEE       
               @@@@@@@@  +++++++++                EEEEE         NARCI         EEEEEEEEEEEEEEE  EEEEEE    EEEEEE    EEEEE       
                  @@@@@  ++++++                                                                                                
                      @  +                                                                                                     
                                                                                                                               
`);

if (typeof GM === "undefined") {
    GM = this.GM || {};
}
unsafeWindow.Vue = window.Vue = Vue;

location.mid = /mid=(\w+)/.exec(location.search)?.[1] || location.pathname.replace(/\/\d+/,"").slice(1);


function ETCM() {
    this.default_commands = {
        _inspectProtocol: true,
        _initialize: true,
        _initializeArticle: true,

        enhanceLogo: true,
        enhanceInfiniteScroll: true,
        enhanceSizableBoard: true,
        enhanceDarkMode: true,

        designTab: true,
        designArticle: true,

        addSteamServerStatusMonitor: false,
        addHumbleChoiceTimer: true,
        addShortcutSide: true,
        _addSideBook: true, addScrapbook: true, addWishbook: false, addPurchasebook: false,
        addBookmark: true,
        addContextMenu: true,

        upgradeLogo: true,
        upgradeProfile: true,
        upgradeAppInfoDetails: false,
        upgradeGameTagbox: true,
        upgradeCBTable: true,

        modifyOthers: true,
    };
    this.recursive_commands = {
        _initializeArticle: true,

        modifyOthers: true
    };
    this.default_settings = {
        humble_choice_show_period: 35, //always
        humble_choice_timer_design: "Analog",
        loading_case: "magnify",
        board_width: "1070px",
        dark_mode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
        show_miniprofile: false
    };


    let majorVersion = v => v.split('.').slice(0, 3).join('.'),
        set_force = majorVersion(loadFromLocalStorage("etcm-version")) < majorVersion(GM.info.script.version); //update
    saveToLocalStorage("etcm-version")(GM.info.script.version);


    this.settings =     refStorageObject("settings", { initial: set_force? this.default_settings : null });
    this.commands =     refStorageObject("commands", { initial: set_force? this.default_commands : null });
    this.selectedTabs = refStorageObject(location.mid+ "_tab", { getHandler: (target, prop, value) => 
                                    target[prop] === undefined? true : target[prop]} );

    this._preview();


    this.upgrade = new this.Upgrade(this);
    this.run = (condition, ...arg)=> {
        condition = condition || (()=>true);

        Object.entries(Object.getPrototypeOf(this))
            .filter(([property, value])=> condition([property, value]) && this.commands[property] && typeof value === "function")
            .forEach(([property, func])=> {
                try{ func.apply(this, arg) }
                catch(e) { this._alert(e); console.error(e); }
            });
    };

    this.upgrade.run();
};

ETCM.prototype = Module;
Module.Upgrade = Upgrade;



if (window.etcmIsRunning) return;
else window.etcmIsRunning = true;

let etcm = new ETCM();

document.addEventListener('DOMContentLoaded', function () {

    /* inject stylesheet */
    GM.addStyle([ "default.css", "dark.css", "bookmark.css", ], { isLink: true, isResource: true });
    GM.addStyle([ meta.css.toggleSwitch, meta.css.TimeCircles, 
                  meta.css.flipclock, meta.css.contextMenu ],   { isLink: true, isResource: false });

    /* start point */
    etcm.run();
    console.info("EnhancedITCM running.");
    /*------------*/
});