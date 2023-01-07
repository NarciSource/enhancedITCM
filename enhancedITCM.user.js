// ==UserScript==
// @name         enhancedITCM
// @namespace    etcm
// @version      0.1.15.6
// @description  EnhancedITCM is a user script that enhances the https://itcm.co.kr/
// @author       narci <jwch11@gmail.com>
// @match        *://itcm.co.kr/*
// @icon         https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/icon.png
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      http://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      http://cdnjs.cloudflare.com/ajax/libs/ramda/0.25.0/ramda.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.18/vue.min.js
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
// @require      https://raw.githubusercontent.com/NarciSource/steamCb.js/master/src/tablesorter.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/js/meta.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/js/utility.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/js/module.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/js/module_upgrade.js
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


function ETCM() {
    this.default_commands = [
        "_inspectProtocol",
        "_initialize",
        "_initializeArticle",

        "enhanceLogo",
        "enhanceInfiniteScroll",
        "enhanceSizableBoard",
        "enhanceDarkMode",

        "addFilter",
        //"addSteamServerStatusMonitor",
        "addHumbleChoiceTimer",
        "addShortcutSide",
        "addArticleBlacklist",
        //"addMemberBlacklist",
        "addScrapbook",
        //"addWishbook",
        //"addPurchasebook",
        "addBookmark",
        "addContextMenu",

        "upgradeLogo",
        "upgradeProfile",
        //"upgradeAppInfoDetails",
        "upgradeGameTagbox",
        "upgradeCBTable",

        "modifyArticle",
        "modifyShortlyVote",
        "modifyWishCheck",
        "modifyOthers",

        "refreshContent",
    ];
    this.recursive_commands = [
        "_initializeArticle",

        "addMemberBlacklist",
        "addArticleBlacklist",

        "modifyArticle",
        "modifyShortlyVote",
        "modifyWishCheck",
        "modifyOthers"
    ];
    this.default_settings = {
        humble_choice_show_period: 35, //always
        humble_choice_timer_design: "Analog",
        loading_case: "magnify",
        board_width: "1070px",
        dark_mode: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
        show_miniprofile: false
    };



    if (loadFromLocalStorage("etcm-version") !== GM.info.script.version) { //update
        saveToLocalStorage("etcm-version")(GM.info.script.version);
        var set_force = true;
    }

    this.commands = ProxySet("commands", this.default_commands, set_force);
    this.settings = ProxyObject(this.default_settings, set_force);

    this.blacklist = ProxySet("blacklist", [/*empty*/]);
    this.blacklist_member = ProxySet("blacklist_mber", [/*empty*/]);
    this.selectTabs = undefined;


    this._preview();


    this.upgrade = new this.Upgrade(this);
    this.run = (condition, ...arg)=> {
        condition = condition || (()=>true);

        Object.entries(Object.getPrototypeOf(this))
            .filter(([property, value])=> condition([property, value]) && this.commands.has(property) && typeof value === "function")
            .forEach(([property, func])=> {
                try{ func.apply(this, arg) }
                catch(e) { this._alert(e); console.error(e); }
            });
    };

    this.upgrade.run();
};

ETCM.prototype = Module;
Module.Upgrade = Upgrade;



let etcm = new ETCM();

document.addEventListener('DOMContentLoaded', function () {

    /* inject stylesheet */
    document.addStyle([ meta.css.default, meta.css.dark, meta.css.toggleSwitch, meta.css.bookmark, meta.css.TimeCircles, meta.css.flipclock, meta.css.contextMenu ]);

    /* start point */
    etcm.run();
    console.info("EnhancedITCM running.");
    /*------------*/
});