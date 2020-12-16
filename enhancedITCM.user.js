// ==UserScript==
// @name         enhancedITCM
// @namespace    etcm
// @version      0.1.11
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

;(function ($, window, document, undefined) {

this.$ = window.jQuery.noConflict(true);


if (typeof GM === "undefined") {
    GM = this.GM || {};
}


GM.addStyle([
    "etcm-dft-style",
    "etcm-set-style",
    "etcm-tgg-style",
    "etcm-bmk-style",
    "etcm-tcr-style",
    "etcm-flc-style",
    "etcm-cmn-style",
    "etcm-drk-style",
], "resource");


(function enhanceMoment(moment) {
    moment.prototype.nextDay = function(day) {
        if (typeof day === "string") {
            day = this.localeData().weekdaysParse(day);
        }
        if (this.weekday() > day) {
            this.add(1,'week');
        }
        this.weekday(day);
        return this;
    };
    moment.locale('ko');
})(moment);


var saveTo = R.curry((storage, name, value)=> storage.setItem(name, (typeof value==="object")? JSON.stringify(value) : value)),
    loadFrom = R.curry((storage, name)=> storage.getItem(name)),
    deleteFrom = R.curry((storage, name)=> storage.removeItem(name));

var saveToLocalStorage = saveTo(localStorage),
    loadFromLocalStorage = loadFrom(localStorage),
    deleteFromLocalStorage = deleteFrom(localStorage),
    saveToHugeStorage = saveTo(GM),
    loadFromHugeStorage = loadFrom(GM),
    deleteFromGMStorage = deleteFrom(GM); 



function ProxySet(key, value, force) {
    class ProxySet extends Set {
        constructor(key, value, force) {
            super((force || !loadFromLocalStorage(key))? value : JSON.parse(loadFromLocalStorage(key)));
            
            this._saveIntoStorage = ()=> saveToLocalStorage(key)(Array.from(this));

            this._saveIntoStorage();

            return this;
        }

        has(arg) {
            if (typeof arg === "object") {
                let subject = JSON.stringify(arg);
                arg = [...this].find(each => JSON.stringify(each) === subject) || arg;
            }
            return Set.prototype.has.call(this, arg);
        }
        delete(arg) {
            if (typeof arg === "object") {
                let subject = JSON.stringify(arg);
                arg = [...this].find(each => JSON.stringify(each) === subject) || arg;
            }
            return Set.prototype.delete.call(this, arg);
        }
        in(arg) {
            if (Array.isArray(arg)) {
                arg.forEach(each=> this.add(each));
            } else {
                this.add(arg);
            }
            this._saveIntoStorage();
            return this;
        }
        out(arg) {
            if (Array.isArray(arg)) {
                arg.forEach(each=> this.delete(each));
            } else {
                this.delete(arg);
            }
            this._saveIntoStorage();
            return this;
        }
        io(bool, arg) {
            bool? this.in(arg) : this.out(arg);
            return this;
        }
        switch(arg) {
            this.has(arg)? this.out(arg) : this.in(arg);
            return this;
        }
        filter(func) {
            return new ProxySet(undefined, Array.from(this).filter(func));
        }
    }

    return new ProxySet(key, value, force);
}

function ProxyObject(obj, force) {
    Object.entries(obj).forEach(([key, val])=> {
        if (force || !loadFromLocalStorage(key)) saveToLocalStorage(key)(val);
        else obj[key] = loadFromLocalStorage(key);
    });
    
    return new Proxy(obj, {
        get(target, key, receiver) {
            if (!Reflect.has(target, key, receiver)) {
                return loadFromLocalStorage(key);
            }
            return Reflect.get(target, key, receiver);
        },
        set(target, key, val, receiver) {
            saveToLocalStorage(key)(val);
            return Reflect.set(target, key, val, receiver);
        }
    });
}

`
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
                                                                                                                               
`


const dynamicstore_url = "https://store.steampowered.com/dynamicstore/userdata/",
      steam_signin_url = "https://store.steampowered.com/login/",
      profile_url = "https://steamcommunity.com/my/ajaxaliases",
      steamstat_url = "https://crowbar.steamstat.us/Barney";



function ETCM() {
    this.default_commands = [
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

        "upgradeProfile",
        //"upgradeAppInfoDetails",
        "upgradeGameTagbox",
        "upgradCBTable",

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

    this.$contents = $('table.bd_lst.bd_tb');
    this.$articles = this.$contents.children('tbody').children('tr');



    this.upgrade = new this.Upgrade(this);
    this.run = (condition, arg)=> {
        condition = condition || (()=>true);

        Object.entries(Object.getPrototypeOf(this))
            .filter(([property, value])=> condition([property, value]) && this.commands.has(property) && typeof value === "function")
            .forEach(([property, func])=> {
                try{ func.call(this, arg) }
                catch(e) { console.error(e) }
            });
    };
};



/* Collect information about a user who is currently connected to Steam Web Page. */
ETCM.prototype._loadProfileInfo = async function() {
    let profileinfo = await GM.ajax({
                            dataType: "json",
                            url: dynamicstore_url,
                        });
    if (profileinfo === undefined || profileinfo.rgOwnedApps.length === 0) {
        console.error("Steam account is strange...");
    }
    saveToHugeStorage("profileinfo")(profileinfo);
    return profileinfo;
};


ETCM.prototype._initialize = function() {
    const etcm = this;

    /* setting page buttons */
    $('<li>', {
        html: $('<a>', {
            class: 'login_A',
            text: 'EnhancedITCM설정',
            click: etcm.openSettings.bind(etcm),
            css: { cursor: "pointer" }
        })
    }).insertAfter($('.wrap_login').find('li').last());


    $('.wrap_profile').addClass('etcm-profile');
    $('#scrollUp').addClass('etcm-scrollUp');
}

ETCM.prototype._initializeArticle = function($articles) {
    $articles = $articles || this.$articles;

    $articles
        .addClass('etcm-article')
        .each(function() {
            var href = $(this).hasClass('notice')? 
                            $(this).children('.title').children('a').get(0).href
                            : $(this).children('.title').children('.hx').data('viewer'),
                document_srl = /(?:\/g_board\/|\/game_news\/|document_srl=)(\d+)/.exec(href)[1];
            $(this).data({document_srl});
        });
}



ETCM.prototype.enhanceLogo = function() {
    const etcm = this;

    (async function newLogo() {
        $('.logo').on('imgSwitch', async function(e) {
            $(this).find('img')
                .attr({ src: await GM.getResourceUrl(e.url || 'etcm-logo', "image/png") });
        })
        .trigger($.Event('imgSwitch'));
    })();


    (async function readSteamProfileCurrentlyConnected() {
        const signin_name = (await GM.ajax(profile_url))[0].newname;
        if (signin_name === undefined) {
            $('.logo').append(
                $('<a>', {
                    class: 'etcm-sign',
                    css: {color: 'red'},
                    text: "sign in",
                    href: steam_signin_url
                })
            );
            deleteFromLocalStorage("profileinfo");
        }
        else {
            $('.logo').append(
                $('<a>', {
                    class: 'etcm-sign',
                    html: $.merge(
                        $('<i>', { class: 'fa fa-refresh'}),
                        $('<span>', { text: ` working : ${signin_name}`})
                    ),
                    click: async ()=> {
                        etcm.profileinfo = await etcm._loadProfileInfo();
                        etcm.upgrade.run(undefined, etcm.profileinfo);
                    }
                })
            );
            etcm.profileinfo = await loadFromHugeStorage("profileinfo");
            etcm.profileinfo = etcm.profileinfo? JSON.parse( etcm.profileinfo ) : await etcm._loadProfileInfo();
            etcm.upgrade.run(undefined, etcm.profileinfo);
        }
    })();
};


/* infinite scroll */
ETCM.prototype.enhanceInfiniteScroll = function() {
    const etcm = this,
        loading_bar = $('<div>', {
            appendTo: '.btm_mn',
            class: `etcm-loading etcm-loading--${etcm.settings.loading_case}`,
        }).hide();


    $(window).scroll(function() {
        if (loading_bar.is(':hidden') && $(window).scrollTop() > $(document).height() - $(window).height() - 50) {
            let url = $('.bd_pg').find('.direction').last().attr('href');
            if (url) {
                loading_bar.show();                
                
                $.ajax({ url }).then(html=> {
                    let $loaded_html = $(html),
                        $loaded_content = $loaded_html.find('.bd_lst.bd_tb').children('tbody'),
                        $loaded_articles = $loaded_content.children('tr').not('.notice');


                    let condition = ([property, value])=> etcm.recursive_commands.includes(property);
                    etcm.run( condition, $loaded_articles );
                    etcm.refreshContent( $loaded_articles );

                    etcm.$articles = etcm.$contents.children('tbody').append( $loaded_articles ).children('tr');

                    $('.bd_pg').replaceWith($loaded_html.find('.bd_pg'));
                    loading_bar.hide();

                }).fail(err=> console.warn(err));
            }
        }
    });
};


ETCM.prototype.enhanceSizableBoard = function() {
    $('.xe').css({
                width: this.settings["board_width"],
                margin: '0px auto'
            })
            .resizable({
                handles: 'e',
                minWidth: '1070px',
                stop: (e, ui)=> { this.settings["board_width"] = ui.size.width }
            })
        .children('.ui-resizable-handle')
            .hover(function () { $(this).toggleClass('etcm-resizable-handle--hover') })
            .appendTo('.wrap_content');
    $('.xe_width')
        .addClass('etcm-board-width');
}


ETCM.prototype.enhanceDarkMode = function() {
    const etcm = this;
    $('<div>', {
        class: 'etcm-dark-mode-switch toggleSwitch',
        html: [
            $('<input>', {
                type: 'checkbox',
                id: 'etcm-dark-mode',
                class: 'toggleSwitch__input',
                checked: $.parseJSON(etcm.settings["dark_mode"]),
                change: async function () {
                    etcm.settings["dark_mode"] = $(this).prop('checked');

                    $('html').toggleClass('etcm--dark', etcm.settings["dark_mode"]);

                    $('.logo').trigger($.Event(
                        'imgSwitch', { url: etcm.settings["dark_mode"] ? 'etcm-dark-logo' : undefined }));
                }
            }),
            $('<label>', {
                for: 'etcm-dark-mode',
                class: 'toggleSwitch__label',
                html: $('<div>', {
                    html: [ $('<i>', { class: 'xi-night' }),
                            $('<i>', { class: 'xi-sun' }) ]
                })
            })
        ]
    }).appendTo($('<li>')).parent().appendTo($('.wrap_login').children('div'));

    $('html').toggleClass('etcm--dark', $.parseJSON(etcm.settings["dark_mode"]));

    $('.logo').trigger($.Event(
        'imgSwitch', { url: etcm.settings["dark_mode"] ? 'etcm-dark-logo' : undefined }));
}



ETCM.prototype.addHumbleChoiceTimer = function() {
    function addTimer({text, title, class_name, date, href, board_title, board_href}) {
        return $('<div>', {
            class: 'etcm-timer '+class_name,
            html: [
                $('<div>', {
                    class: 'etcm-timer__title',
                    html: [
                        $('<a>', {
                            class: 'etcm-timer__title__text',
                            text, title, href
                        }),
                        $('<a>', {
                            class: 'etcm-timer__title__redirect fa fa-tag',
                            title: board_title, href: board_href,
                            toggle: board_href!==undefined
                        })
                    ]
                }),
                $('<div>', {
                    class: 'etcm-timer__dashboard',
                    data: {
                        timer: date.diff(moment(), 'seconds')
                    }
                }),
                $('<div>', {
                    class: 'etcm-timer__footer',
                    html: [
                        $('<p>', {
                            class: 'etcm-timer__footer__time',
                            text: date.format("MMMM Do(dddd) h:mm")
                        })
                    ]
                })
            ]}).toggle( date.diff(moment(), 'seconds')>0 );
    }

    function setToAnalogClock() {
        this.TimeCircles({
                count_past_zero: false,
                total_duration: 'Months',
                animation: 'smooth',
                bg_width: 3.2,
                fg_width: 0.02,
                number_size: 0.2,
                text_size: 0.13,
                circle_bg_color: '#FFF',
                time: {
                    Days: { text: "일", color: 'cadetblue' },
                    Hours: { text: "시", color: '#bb3d3d' },
                    Minutes: { text: "분", color: '#48698d' },
                    Seconds: { text: "초", color: '#fdc76c' }
                }
            });
    }

    function setToDigitalClock() {
        this.FlipClocks({
                autoStart: true,
                countdown: true,
                interval: 1000*60,
                clockFace: 'DailyCounter'
            });
    }

    function lz_makeDashboard(launchDate, autoPayDate) {
        let instance = undefined;
        return function() {
            instance = instance ||
                $('<div>', { class: 'column etcm-humble-choice-timer' })
                    .insertAfter( $('aside.e1').children('.column_login') )

                    .append( addTimer({ text: "Humble Choice", class_name: 'release-choice', date: launchDate,
                                        title: "구매하러 가기",
                                        board_title: "게시판에서 찾기",
                                        board_href: "/?_filter=search&mid=game_news&search_keyword=humble+choice&search_target=title",
                                        href: "https://www.humblebundle.com/subscription"}))
                    .append( addTimer({ text: "자동 결제일", class_name: 'auto-subscribe', date: autoPayDate,
                                        title: "일시정지하러 가기",
                                        href: "https://www.humblebundle.com/user/pause-subscription"}))

                    .find('.etcm-timer__dashboard');

            instance.setToAnalogClock = setToAnalogClock;
            instance.setToDigitalClock = setToDigitalClock;
            return instance;
        }
    }

    function upcoming(event) {
        const now = moment(),
              eventday = event(now);
        return now.isBefore(eventday)? eventday : event(now.add(1,'month'));
    }



    const humbleChoiceEvent = time=> time.clone().tz('America/New_York').startOf('month').nextDay('금요일').hours(13).tz('Asia/Seoul'),
          launchDate = upcoming(humbleChoiceEvent),
          autoPayDate = launchDate.clone().subtract(1,'week'),
          call_dashboards = lz_makeDashboard(launchDate, autoPayDate);

    if (this.settings["humble_choice_show_period"] >= launchDate.diff(moment(), 'days')) {//causes resource problem
        call_dashboards().setToDigitalClock(); return;
        if (this.settings["humble_choice_timer_design"] === "Analog") {
            call_dashboards().setToAnalogClock();
        }
        else if (this.settings["humble_choice_timer_design"] === "Digital") {
            call_dashboards().setToDigitalClock();
        }
    }
};


/* steam server status monitor */
ETCM.prototype.addSteamServerStatusMonitor = function() {
    $('<div>', {
        insertAfter: $('aside.e1').children('.column_login'),
        class: 'column etcm-steam-server-monitor',
        html: [
            $('<div>', {
                class: 'etcm-steam-server-monitor__title',
                text: "Steam Server"
            }),
            $('<div>', {
                class: 'etcm-steam-server-monitor__icon',
                on: {
                    mouseenter: function() {
                        $(this).animate({ deg: 360 }, {
                            duration: 600,
                            step: function(now) {
                                $(this).css({ transform: `rotate(${now}deg)` });
                            },
                            complete: function() {
                                $(this)[0].deg=0;
                            }
                        });
                    },
                    click: refresh
                },
                html: $('<i>', { class: 'fa fa-dashboard' })
            }),
            $('<ul>', { class: 'etcm-steam-server-monitor__list' }),
            $('<div>', { class: 'etcm-steam-server-monitor__time' })
        ]
    });

    function makeSteamServerMonitorList(name, text) {
        $('<li>', {
            attr: {name},
            html: $.merge(
                $('<i>', { class:'fa fa-circle' }),
                $('<span>', { text })
            )
        }).appendTo($('.etcm-steam-server-monitor__list'));
    }

    async function loadSteamServerStatus() {
        const steam_server = await GM.ajax(steamstat_url);

        return { time: new Date(steam_server.time*1000),
                 perc: steam_server.online,
                 ...steam_server.services };
    }

    async function refresh() {
        const s = await loadSteamServerStatus();

        $('.etcm-steam-server-monitor__time').text( moment().format("LTS") );

        $('.etcm-steam-server-monitor__icon').attr('title',s.perc+"%").css({color: s.online.status==="good"? 'green':'red'});
        $('.etcm-steam-server-monitor__list').children('li').each((_,el)=> {
            const name = $(el).attr("name");
            $(el).attr('title',s[name].title).css({color: s[name].status==="good"? 'green':'red'})
        });
    }


    makeSteamServerMonitorList("community", "Community");
    makeSteamServerMonitorList("store", "Store");
    makeSteamServerMonitorList("database", "Database");
    makeSteamServerMonitorList("webapi", "WebAPI");
    refresh();
};


/* Provide useful shortcuts related to this game. */
ETCM.prototype.addShortcutSide = function() {
    function makeShortcut(fa_icon, text, href) {
        return $('<li>', {
                    class: 'etcm-shortcut',
                    html: $.merge(
                            $('<i>', { class: 'fa ' + fa_icon }),
                            $('<a>', { text, href })
                        )
        });
    }

    $('.wrap_info').each(function() {
        if ($(this).find('.app_name').get(0).hostname === "store.steampowered.com") {
            const pathname = $(this).find('.app_name').get(0).pathname,
                  gamename = $(this).find('.app_name').text(),
                  [_, div, id] = /\/(\w+)\/(\d+)/.exec(pathname);

            if (div === "app") {
                const appid = id;

                $('<ul>', { class: 'etcm-shortcut-menu' })
                .appendTo($(this))

                .append(
                    makeShortcut('fa-play', " Run Game", `steam://run/${appid}`)
                )
                .append(
                    makeShortcut('fa-database', " Steam Database", `https://steamdb.info${pathname}`)
                )
                .append(
                    makeShortcut('fa-usd', " IsThereAnyDeal", `https://isthereanydeal.com/search/?q=${gamename}`)
                )
                .append(
                    makeShortcut('fa-id-badge', " SteamCard", `https://www.steamcardexchange.net/index.php?gamepage-appid-${appid}`)
                )
                .append(
                    makeShortcut('fa-clock-o', " HowLongToBeat", `https://howlongtobeat.com/game.php?id=${appid}`)
                )
                .append(
                    makeShortcut('fa-wikipedia-w', " PC Gaming Wiki", `http://pcgamingwiki.com/api/appid.php?appid=${appid}`)
                );
            }
        }
    });
};


ETCM.prototype.addFilter = function() {
    const etcm = this;

    (function handleGamenewsTabs() {
        if (!( window.location.href.includes("game_news")
            && $('.inner_content').children('div').eq(0).find('img').attr('src').includes("/store/") )) {
            return;
        }

        function addTab({store_name, img_src, width, height}) {
            width = width || '29px';
            height = height || '29px';

            $('<li>', {
                appendTo: this,
                class: 'etcm-tab--store',
                title: store_name,
                html: $('<a>', {
                    href: `/?mid=game_news&search_keyword=${store_name}&search_target=extra_vars2&_sort_index=timer_filter`,
                    html: $.merge(
                        $('<img>', {
                            src: img_src,
                            css: {width, height}
                        }),
                        $('<span>', {
                            text: store_name.toLowerCase()
                        }).hide()
                    )
                })
            });
            return this;
        }

        function removeTab(store_name) {
            this.find('span').filter((_,el)=> el.innerText === store_name)
                .closest('.etcm-tab--store').remove();
            return this;
        }

        function insertTab($tabs) {
            this.append(
                $.map($tabs, function(val) {
                    const store_name = /[&|?]search_keyword=([^&]+)/.exec(decodeURI(val.search))[1];
                    return $('<li>', {
                        class: 'etcm-tab--store',
                        title: store_name,
                        html: $(val).append(
                                $('<span>', {
                                    text: store_name.toLowerCase()
                                }).hide()
                            )
                    });
                })
            );
            return this;
        }


        let $div = $('.inner_content').children('div').eq(0),
            $etcm_cTab_store = $('<ul>', {
                    class: 'etcm-cTab--store',
                    css: {display: 'flex'}
                });

        $etcm_cTab_store.addTab = addTab;
        $etcm_cTab_store.removeTab = removeTab;
        $etcm_cTab_store.insertTab = insertTab;


        $etcm_cTab_store
            .insertTab($div.find('a'))
            .addTab({store_name: "Chronogg", img_src: "https://www.chrono.gg/assets/images/branding/chrono-icon--dark.9b6946b4.png"})
            .addTab({store_name: "WinGameStore", img_src: "https://www.wingamestore.com/images/s2/logo-icon.png"})
            .addTab({store_name: "Nuuvem", img_src: "https://assets.nuuvem.com/assets/fe/images/nuuvem_logo-ab61ec645af3a6db7df0140d4792f31a.svg"})
            .addTab({store_name: "MicrosoftStore", img_src: "https://c.s-microsoft.com/en-us/CMSImages/Microsoft_Corporate_Logo_43_42.jpg?version=77D1E093-019E-5C72-083F-4DF9BF1362F5"})
            .addTab({store_name: "DailyIndieGame"})
            .addTab({store_name: "OtakuBundle"})
            .addTab({store_name: "GoGoBundle"})
            .addTab({store_name: "기타"})
            .removeTab("gamethor")
            .appendTo($div);
    })();



    (function makeBlacklistTab() {
        $('.cTab').append($('<li>', {
            class: 'etcm-tab--hide',
            html : $('<a>', {
                class: 'fa fa-eye-slash',
                html: $('<span>', { text: "black" }).hide()
            })
        }))
    })();



    (function remodelingTabs() {
        let $tabs = $(/*empty*/);
        if (window.location.href.includes("game_news")) {
            $tabs = $('.cTab').children('li').slice(0,4).add('.etcm-tab--hide').add('.etcm-tab--store');
            etcm.selectTabs = ProxySet("game_news_tab", $tabs.children('a').map((_,el)=>$(el).text().trim()) );
        }
        if (window.location.href.includes("g_board")) {
            $tabs = $('.cTab').children('li');
            etcm.selectTabs = ProxySet("g_board_tab", $tabs.children('a').map((_,el)=>$(el).text().trim()) );
        }
    
        $tabs.each((_, li)=>{
            let $tab = $(li).addClass('etcm-tab');
    
            $('<input>', {
                appendTo: $tab,
                type: 'checkbox',
                checked: function() {
                    const checked = etcm.selectTabs.has($(this).prev().text().trim());
                    $(this).parent().toggleClass('check', checked);
                    return checked;
                },
                change: function() {
                    const tab_current_text = $(this).prev().text().trim(),
                          checked = $(this).is(':checked');
    
    
                    $tab.toggleClass('check', checked);
                    etcm.selectTabs.io(checked, tab_current_text);
    
    
                    if ($tab.hasClass('home')) {
                        $tabs.not('.home').children('input').prop('checked',checked).change();
    
                    } else {
                        if (!checked) {
                            const tab_home_text = $tabs.filter('.home').children('a').text();
    
                            $tabs.filter('.home').toggleClass('check', checked)
                                .children('input').prop('checked',checked);
                            etcm.selectTabs.io(checked, tab_home_text);
                        }
                    }
                    etcm.refreshContent();
                }
            });
        });
    })();    
};

/* Show blacklist icon and manage list */
ETCM.prototype.addArticleBlacklist = function($articles) {
    const etcm = this;
    $articles = $articles || etcm.$articles;

    $articles
        .each((_, article)=> {
            $(article).children('.title').append(
                $('<span>', {
                    class: 'fa fa-eye-slash',
                    click: function() {
                        etcm.blacklist.switch( $(article).data('document_srl'));
                        etcm.refreshContent();
                    }
                })
            );
        });
};

ETCM.prototype.addMemberBlacklist = function($articles) {
    const etcm = this;
    $articles = $articles || etcm.$articles;

    $articles
        .each((_, article)=> {
            $(article).children('.author').append(
                $('<span>', {
                    class: 'fa fa-eye-slash',
                    click: function() {
                        const member_id = $(this).prev().children('a').attr('class');

                        etcm.blacklist_member.switch(member_id);
                        etcm.refreshContent();
                    }
                })
            );
        });
};


/* side menu */
async function addSideBook({name, title, url, tabIcon, parser}) {
    async function loadListbook() {
        let html = await GM.ajax( url );
        return parser(html);
    }

    function decorateList(list) {
        return Array.from(list).map(({text, href})=>
            $('<li>', {
                class: 'etcm-side__book__list__article',
                html: $('<a>', {
                    href,
                    html: $.merge(
                        $('<img>', {src: "/widgets/treasurej_popular/skins/DW_Portal/img/docu.gif"}),
                        $('<span>', {text})
                    )
                })
            }));
    }

    function tabMenuToggle(thisBtn) {
        var targetBox = $('#' + thisBtn.attr('name'));
        var targetUl = thisBtn.parent('li').parent('ul');
        var allBox = thisBtn.parent('li').parent('ul').parent('div').next('div').children('div');
        var targetLi = thisBtn.parent('li').parent('ul').children('li');
        var target_Li = thisBtn.parent('li');

        if (!thisBtn.parent('li').hasClass('on')) {
            targetLi.removeClass('on');
            allBox.removeClass('wrapTab_on');
            targetBox.addClass('wrapTab_on');
            target_Li.addClass('on');
        };
        if (thisBtn.attr('href') === '#') {
            return false;
        };
    }

    /* side frame */
    const $side = $('.etcm-side').length != 0 ? $('.etcm-side')
        : $('<div>', {
            class: 'etcm-side',
            html: [
                $('<h2>', {
                    class: 'etcm-side__title',
                    html: [
                        $('<span>', { text: "개인 목록" }),
                        $('<div>', {
                            html: [
                                $('<label>', {
                                    class: 'fa fa-compress',
                                    title: "축소/확장",
                                    html:
                                        $('<input>', {
                                            type: 'checkbox',
                                            click: function () {
                                                $(this).parent().toggleClass('fa-expand');
                                                $(this).parent().toggleClass('fa-compress');
                                                $(this).closest('.etcm-side').find('.etcm-side__book__list')
                                                       .toggleClass('etcm-side__book__list--collapse');
                                            }
                                        }),
                                    hover: function () {
                                        $(this).toggleClass('fa-expand');
                                        $(this).toggleClass('fa-compress');
                                    }
                                }),
                                $('<i>', {
                                    class: 'fa fa-refresh',
                                    title: "업데이트",
                                    on: {
                                        click: function() {
                                            $(this).closest('.etcm-side').find('.tab_a').each((_, item) => $(item).click());
                                        },
                                        mouseenter: function () {
                                            $(this).animate({ deg: 360 }, {
                                                duration: 600,
                                                step: function (now) { $(this).css({ transform: `rotate(${now}deg)` }) },
                                                complete: function () { $(this)[0].deg = 0 }
                                            });
                                        }
                                    }
                                })
                            ]
                        })
                    ]
                }),

                $('<div>', {
                    class: 'etcm-side__body',
                    html: [
                        $('<div>', {
                            class: 'tab_top',
                            html: $('<ul>', {
                                class: 'wrapTab clearBoth'
                            })
                        }),
                        $('<div>', {
                            class: 'tab_bottom'
                        })
                    ]
                })
            ]
        });

    $('.sub_wrap_widget').children().eq(0).after($side);



    /* add tab menu */
    $('<li>', {
        class: 'tab_li',
        html: $('<a>', {
            class: 'tab_a',
            name,
            html: [
                $('<i>', { class: tabIcon }),
                title
            ],
            on: {
                click: async function update() {
                    let listbook = ProxySet(name, []);
                    listbook.clear();
                    listbook.in(await loadListbook());

                    $("#" + name).children('.etcm-side__book__list').children('li')
                        .remove();
                    $("#" + name).children('.etcm-side__book__list')
                        .append(decorateList(listbook));
                },
                dblclick: () => window.open(url, '_self'),
                mouseover: function () { tabMenuToggle($(this)) }
            }
        })
    }).appendTo($side.find('.tab_top').children('ul'));


    /* add list */
    $('<div>', {
        id: name,
        class: 'tab_div',
        html: $('<ul>' , {
            class: 'etcm-side__book__list etcm-side__book__list--collapse',
            html: decorateList(ProxySet(name, []))
        })
    }).appendTo($side.find('.tab_bottom'));


    /* init */
    $side.find('.tab_top').children('ul').children('li').eq(0).addClass('on');
    $side.find('.tab_div').eq(0).addClass('wrapTab_on');
};

ETCM.prototype.addScrapbook = async function() {
    addSideBook({
        name: "scrapbook",
        title: "스크랩",
        url: "http://itcm.co.kr/index.php?act=dispMemberScrappedDocument",
        tabIcon: 'xi-bookmark',
        parser: html=>
            $(html).find('.table-striped').find('td.title').children('a')
                .map((_, article)=> {
                    return {
                        text: article.innerText,
                        href: article.pathname
                    };
                }).toArray()
    });
};
ETCM.prototype.addWishbook = async function() {
    addSideBook({
        name: "wishbook",
        title: "찜목록",
        url: "http://itcm.co.kr/index.php?mid=game_news&_sort_index=check_wlist",
        tabIcon: 'xi-cart',
        parser: html=>
            $(html).find('.bd_lst.bd_tb').children('tbody').children('tr').not('.notice').find('td.title').children('a:even')
                .map((_, article)=> {
                    const href = article.search;
                    return {
                        text: article.innerText.trim(),
                        href: /document_srl=(\d+)/.exec(href)[1]
                    };
                }).toArray()
    });
};
ETCM.prototype.addPurchasebook = async function() {
    addSideBook({
        name: "purchasebook",
        title: "구매목록",
        url: "http://itcm.co.kr/index.php?mid=game_news&_sort_index=check_plist",
        tabIcon: 'xi-wallet',
        parser: html=>
            $(html).find('.bd_lst.bd_tb').children('tbody').children('tr').not('.notice').find('td.title').children('a:even')
                .map((_, article)=> {
                    const href = article.search;
                    return {
                        text: article.innerText.trim(),
                        href: /document_srl=(\d+)/.exec(href)[1]
                    };
                }).toArray()
    });
};


ETCM.prototype.addBookmark = function() {
    let bookmark = ProxySet("bookmark", []);

    $('#menu').find('li')
        .each((_, item) => {
            let $a = $(item).children('a'),
                text = $a.text().trim(),
                href = $a.attr('href');

            $(item).append(
                $('<label>', {
                    class: 'bookmark',
                    html: [
                        $('<input>', {
                            type: 'checkbox',
                            checked: bookmark.has({ href, text }),
                            on: {
                                change: function () {
                                    bookmark.io($(this).prop('checked'), { href, text });
                                }
                            }
                        }),
                        $('<span>')
                    ]
                })
            );
        });

    if (bookmark.size && $('.menu_bookmark_remocon').length === 0) {
        $('<div>', {
            class: 'menu_bookmark_remocon',
            html: [
                $('<h2>', { text: "즐겨찾기" }),
                $('<ul>')
            ]
        }).appendTo('.right_banner');
    }

    $('.menu_bookmark_remocon').find('ul').append(
        [...bookmark].map(({ href, text }) => $('<li>', { html: [":: ", $('<a>', { href, text })] }))
    );
}



ETCM.prototype.addContextMenu = function () {
    $('body').append(
        $('<menu>', {
            type: 'context',
            id: "ContextMenu1",
            html: $.merge(
                $('<menuitem>', {
                    label: '스팀 라이브러리',
                    click: () => window.open(`steam://open/minigameslist`,'_self')
                }),
                $('<menuitem>', {
                    label: '스팀 콘솔',
                    click: () => window.open(`steam://open/console`,'_self')
                }))
        })
    ).attr('contextmenu', "ContextMenu1");



    $('a')
        .filter((_, item) => $(item).attr('href') && $(item).attr('href').includes("steampowered.com/app/"))
        .addClass('steamUrl')
        .each((_, item) => {
            const [match, div, id] = /steampowered\.com\/(\w+)\/(\d+)/.exec(item.href);

            $(item).data({ div, id, name: item.text });
        });

    $('a')
        .filter((_, item) => $(item).attr('href') && $(item).attr('href').includes("app="))
        .addClass('itcmGameUrl')
        .each((_, item) => {
            const [match, id] = /app\=(\d+)/.exec(item.href);

            $(item).data({ div: "app", id, name: item.text });
        });



    $.contextMenu({
        selector: '.steamUrl',
        items: {
            store: { name: "스토어 페이지로 가기" },
            steamdb: { name: "스팀디비로 가기" },
            itad: { name: "itad로 가기" },
            itcm: { name: "잇셈 게시글 찾기" },
            itcm_sale: { name: "잇셈 할인글 찾기"},
            step1: "---------",
            run: { name: "바로 실행" }
        },
        callback: function (key, options) {
            let div = this.data("div"),
                id = this.data("id"),
                name = this.data("name");

            switch (key) {
                case "store":
                    window.open(`https://store.steampowered.com/${div}/${id}`,'_blank');
                    break;
                case "steamdb":
                    window.open(`https://steamdb.info/${div}/${id}/`,'_blank');
                    break;
                case "itad":
                    window.open(`https://isthereanydeal.com/search/?q=${name}`,'_blank');
                    break;
                case "itcm":
                    if (div === "app")
                        window.open(`http://itcm.co.kr/index.php?mid=g_board&app=${id}`,'_blank');
                    break;
                case "itcm_sale":
                    window.open(`http://itcm.co.kr/?_filter=search&mid=game_news&search_keyword=${name}&search_target=title_content`,'_blank');
                    break;
                case "run":
                    window.open(`steam://install/${id}`,'_self');
                    break;
            }
        }
    }); 
    
    $('.steamUrl, .itcmGameUrl')
        .attr('title', "")
        .tooltip({
            classes: { "ui-tooltip": "highlight" },
            tooltipClass: "etcm-tooltip-styling",
            content: function () {
                return `<img src="https://steamcdn-a.akamaihd.net/steam/apps/${$(this).closest('.steamUrl, .itcmGameUrl').data("id")}/header.jpg"/>`;
            }
        });
}



/* refresh content */
ETCM.prototype.refreshContent = function($articles) {
    const etcm = this;
    $articles = $articles || etcm.$articles;

    $articles
        .each((_,article)=> {
            /* parse this article */
            let category = $(article).find('.cate').text().trim(),
                document_srl = $(article).data('document_srl'),
                writer_id = $(article).find('.author').find('a').attr('class'),
                title = $(article).find('.title').children('a.hx').title,
                store;

            if (window.location.href.includes("game_news")) {
                $(article).children('td').eq(0).children().children().each(function() {
                    if ($(this).children('img').nullChk()) {
                        store= $(this).children('img').attr('title').toLowerCase();
                    } else {
                        store = $(this).text().toLowerCase().trim().replace("-","");
                    }
                });
            }


            /* If this article is a blacklist then shadow. */
            if (etcm.blacklist.has(document_srl) || etcm.blacklist_member.has(writer_id)) {
                $(article).addClass('etcm-article--shadow');
            }
            else {
                $(article).removeClass('etcm-article--shadow');
            }

            /* Determine whether this article is visible or not. */
            if (
                !etcm.selectTabs ||
                (
                    (
                        !category || etcm.selectTabs.has(category)
                    )
                    &&
                    (
                        !store || etcm.selectTabs.has(store)
                    )
                    &&
                    (
                        !document_srl || etcm.selectTabs.has("black")
                        ||
                        !(
                            etcm.blacklist.has(document_srl) || etcm.blacklist_member.has(writer_id)
                        )
                    )
                )
            ) {
                $(article).show();
            } else {
                $(article).hide();
            }
        });
};



/* Procedures that require profileinfo. */
ETCM.prototype.Upgrade = function(target) {
    this.run = (condition, arg)=> {
        condition = condition || (()=>true);

        Object.entries(Object.getPrototypeOf(this))
            .filter(([property, value])=> condition([property, value]) && target.commands.has(property) && typeof value === "function")
            .forEach(([property, func])=> func.call(this, arg));
    };
};

ETCM.prototype.Upgrade.prototype.upgradeProfile = function(profileinfo) {
    //$('.wrap_profile').append($('<div>', {
    //    text: `게임 수집 : ${profileinfo.rgOwnedApps.length}`
    //}))
};

ETCM.prototype.Upgrade.prototype.upgradeAppInfoDetails = function(profileinfo) {
    $('.app_info_details').each( function() {
        let pathname = $(this).children('.wrap_info').find('.app_name').get(0).pathname,
            [_, div, id] = /\/(\w+)\/(\d+)/.exec(pathname);
        id = Number(id);

        if (profileinfo.rgOwnedApps.includes(id)) {
            $(this).children('.h2_widget_sub').each(function() {
                $(this).text( $(this).text() + " (보유중)" );
            });
        }
    });
};

ETCM.prototype.Upgrade.prototype.upgradeGameTagbox = function(profileinfo) {
    /* add games to gametag using cb-table */
    let cbTable_games = $('.cb-table').children('tbody').children('tr')
        .map((_, tr) => $(tr).children('td').first()[0]).children('a')
        .toArray()
        .map(a => [.../steampowered\.com\/(\w+)\/(\d+)/.exec(a.href).slice(1), a.text]);

    let gameTag_games = $('.steam_read_selected').find('.item_content').find('.name')
        .toArray()
        .map(a => /steampowered\.com\/(\w+)\/(\d+)/.exec(a.href).slice(1));
    

    cbTable_games.diff(gameTag_games, (a,b)=> a[0] == b[0] && a[1] == b[1])
        .map(each => ({ div: each[0], id: each[1], name: each[2] }))
        .filter(({ div, id, name }) => div === "app")
        .map(({ div, id, name }) =>
                $('<tr>', {
                    class: 'no_mi_app',
                    html: [
                        $('<td>', {
                            class: 'app',
                            html: [
                                $('<a>', {
                                    class: 'item_image',
                                    attr: {
                                        href: `/index.php?mid=g_board&${div}=${id}`
                                    },
                                    html: $('<span>', {
                                        html: $('<img>', {
                                            class: 'header_image',
                                            src: `https://steamcdn-a.akamaihd.net/steam/apps/${id}/header.jpg`
                                        })
                                    })
                                }),
                                $('<span>', {
                                    class: 'item_content',
                                    html: $('<span>', {
                                        class: 'wrap_name',
                                        html: $('<a>', {
                                            class: 'name steamUrl',
                                            attr: {
                                                href: `https://store.steampowered.com/${div}/${id}`,
                                                target: '_blank'
                                            },
                                            text: name
                                        })
                                    })
                                })
                            ]
                        }),
                        $('<td>', {
                            class: 'hangul',
                        }),
                        $('<td>', {
                            class: 'wm',
                        }),
                        $('<td>', {
                            class: 'p',
                        })
                    ]
                })[0]
        )
        .coveredTo($)
        .appendTo($('.steam_read_selected').find('tbody'));




    /* recalcuration */
    function makeLine(text) {
        return $('<tr>', {
                class: 'mi_app_live',
                html: $('<td>',{
                    attr: {colspan: '4'},
                    html: $('<span>',{
                        class: 'line',
                        html: $('<span>',{
                            class:'line_txt',
                            html: $('<i>',{
                                class: 'fa fa-chevron-down',
                                attr: {'aria-hidden':'true'},
                                text
                            })
                        })
                    })
                })
            });
    }

    function parsing($app) {
        const [match, div, id] = /steampowered\.com\/(\w+)\/(\d+)/.exec(
            $app.find('.item_content .name').attr('href')
        );
        return {div, id: Number(id)};
    }

    $('.steam_read_selected').each(function() {
        const $tagbox = $(this);

        (function addSeperator() {
            if ($tagbox.find('.mi_app_live').length < 2) {
                $tagbox.find('.mi_app_live').remove();
                $tagbox.find('tbody')
                    .append( makeLine(" 미보유 게임"))
                    .append( makeLine(" 보유 게임"));
            }
        })();

        $tagbox.find('.mi_app_live').eq(0).addClass('mi_not_owned');
        $tagbox.find('.mi_app_live').eq(1).addClass('mi_owned');


        (function fixOwningStatus($apps) {
            $apps.each((_,app)=> {
                const {div, id} = parsing($(app));

                if ((div === "app" && profileinfo.rgOwnedApps.includes(id))
                    || (div === "package" && profileinfo.rgOwnedPackages.includes(id))) {
                    $(app).addClass('mi_app').removeClass('no_mi_app')                          
                          .siblings('.mi_owned').after($(app));
                }
                else {
                    $(app).addClass('no_mi_app').removeClass('mi_app')                          
                          .siblings('.mi_not_owned').after($(app));
                }
            });
        })($tagbox.find('.no_mi_app, .mi_app'));


        (function addWishAndIgnoreStatus($apps) {
            $apps.each((_,app)=> {
                const {div, id} = parsing($(app));

                if (profileinfo.rgWishlist.includes(id)) {
                    $(app).addClass('etcm-wishApp');
                }

                if (Object.keys(profileinfo.rgIgnoredApps).includes(String(id))) {
                    $(app).addClass('etcm-ignoreApp');
                }
            });
        })($tagbox.find('.no_mi_app, .mi_app'));


        (function collapseList($button, $owningApps, $missingApps) {
            $button
                .css({cursor: 'pointer'})
                .click(function() {
                        if ($(this).hasClass('mi_not_owned')) {
                            $owningApps.toggle();
                        }
                        if ($(this).hasClass('mi_owned')) {
                            $missingApps.toggle();
                        }
                    });
        })($tagbox.find('.mi_app_live'), $tagbox.find('.no_mi_app'), $tagbox.find('.mi_app'));
    });
};

ETCM.prototype.Upgrade.prototype.upgradeCBTable = function(profileinfo) {
    $('.cb-table > tbody > tr')
        .each(function () {
            const href = $(this).find('a').attr('href');
            let [match, div, id] = /steampowered\.com\/(\w+)\/(\d+)/.exec(href);
            id = Number(id);


            if ((div === "app" && profileinfo.rgOwnedApps.includes(id))
                || (div === "package" && profileinfo.rgOwnedPackages.includes(id))) {
                $(this)
                    .attr('title', "보유 게임")
                    .css('opacity', 0.3);
            }

            if (profileinfo.rgWishlist.includes(id)) {
                $(this).children().first()
                    .append($('<i>', {
                        class: 'fa fa-shopping-cart',
                        title: "찜한 게임",
                        css: { 'margin-left': '5px' }
                    }));
            }
        });
};



/* modify ui */
ETCM.prototype.modifyArticle = function($articles) {
    $articles = $articles || this.$articles;
    $contents = this.$contents;


    if (!$contents.hasClass('etcm-article-design')) {
        $contents.addClass('etcm-article-design');
        if (window.location.href.includes("game_news")) {
            $contents.find('th').filter(':eq(0), :eq(6), :eq(7), :eq(8)').remove();
            $contents.find('th.title').after($contents.find('th').last());
        }
        else if (window.location.href.includes("timeline")) {
            $contents.find('th').filter(':eq(0), :eq(5), :eq(6), :eq(7)').remove();
        }
        else {
            $contents.find('th').filter(':eq(4), :eq(5), :eq(6)').remove();
        }
    }


    $articles.each((_,article) => {
        if (window.location.href.includes("game_news")) {
            $(article).children('.m_no').first().addClass('store');
        }
        $(article).children('.m_no').last().addClass('voted_count');
        $(article).children('.m_no').last().prev().addClass('readed_count');

        $(article).children('.author').find('.xe_point_level_icon').remove();
        $(article).children('.author').find('a').contents().last()[0].textContent
            = $(article).children('.author').find('img').attr('title');


        $(article).prepend([
            $('<td>', {
                html: [
                    $(article).children('.store').replaceTag('div'),
                    $(article).children('.mid').replaceTag('div'),
                    $(article).children('.cate').replaceTag('div')
                ]
            }),
            $('<td>', {
                class: 'post',
                html: [
                    $(article).find('.time').replaceTag('span'),
                    $(article).children('.title').replaceTag('div'),
                    $('<span>', {
                        class: 'replyNum',
                        html: $(article).find('.replyNum').removeClass('replyNum').prepend("댓글: ")
                    }),
                    $(article).children('.readed_count').replaceTag('span').prepend("조회: "),
                    $(article).children('.voted_count').replaceTag('span').prepend("추천: "),
                ]
            }),
            $(article).children('.steam_list_check')
        ]);
    });
};


ETCM.prototype.modifyShortlyVote = function($articles) {
    const etcm = this;
    $articles = $articles || etcm.$articles;

    const entry = etcm.$contents.find('th').length,
          index = etcm.$contents.find('th').index( etcm.$contents.find('.voted_count') );

   ($articles.find('.voted_count').nullChk()
   ||
   $articles.children(`:nth-child(${entry}n+${index + 1})`).addClass('vote_count'))
        .each((_, el)=> {

            $(el).html($('<i>', { text: $(el).text() }))
                 .hover(function() {
                    $(this).children().toggleClass('fa fa-heart') })
                 .click(function() {
                    doCallModuleActionDocumentVote('document', 'procDocumentVoteUp', $(el).parent().data('document_srl'));

                    function doCallModuleActionDocumentVote(module, action, target_srl, vars1) {
                        const params = {'target_srl':target_srl,'cur_mid':current_mid, 'vars1':vars1};
                        unsafeWindow.jQuery.exec_json(module+'.'+action, params, completeDocumentVote);
                    }
                    function completeDocumentVote(ret_obj) {
                        const voted_count = ret_obj.voted_count;
                        if(!isNaN(parseInt(voted_count))) {
                            $(el).children().text(voted_count);
                        }
                    }
                });
        });
};


ETCM.prototype.modifyWishCheck = function($articles) {
    const etcm = this;
    $articles = $articles || etcm.$articles;

    $articles.find('.steam_list_check')
        .find('label').children().hide()
        .closest('label').filter(':even').append(
            $('<i>', {
                class: 'fa fa-credit-card',
                title: "구입 목록에 추가"
            })
        ).next().append(
            $('<i>', {
                class: 'fa fa-shopping-cart',
                title: "찜 목록에 추가"
            })
        );
};


ETCM.prototype.modifyOthers = function($articles) {
    const etcm = this;
    $articles = $articles || etcm.$articles;


    (function fixAppImageFading($app_img) {
        $app_img.find('img').each(function() {
            $(this).attr('src', $(this).data('original') );
        });
    })($articles.find('.app_image'));


    (function fixTitleFading($hx) {
        $hx.each((_, el)=> $(el).text($(el).attr('title')));
    })($articles.find('.hx'));


    if (window.location.href.includes("game_news")) {

        (function fixStoreFilterTitle() {
            $articles.each((_,el)=> {
                const $store = $(el).children().eq(0).children().children();
                $store.attr('title',$store.text().trim()).css({width:'45px',overflow:'hidden'});
            });
        })();
    }
};



/* Setting */
ETCM.prototype.openSettings = async function() {
    const etcm = this;

    function initialize(commands) {

        (function setSwitchBasedOnPreviousRecord($switches) {
            $switches.each(function() {
                $(this).prop('checked', commands.has( $(this).data('command') ));
            });
        })(this.find('.toggleSwitch__input'));


        (function setSubvalueOfHumbleChoiceTimerBasedOnPreviousRecord($humble_timer_checkbox) {
            $humble_timer_checkbox
                .prev('.etcm-settings__operation > .option')
                    .toggle( commands.has( $humble_timer_checkbox.data('command')) )
                .children()
                    .first('.etcm-settings__operation .option__timer-design').val( etcm.settings["humble_choice_timer_design"])
                    .next('.etcm-settings__operation .option__show-period').val( etcm.settings["humble_choice_show_period"] );

        })(this.find('#etcm-settings--humble-choice-timer'));


        (function highlightLoadingCaseBasedOnPreviousRecord($loading_cases) {
            $loading_cases
                .filter(function() {
                    return $(this).data('loading') === etcm.settings.loading_case;
                })
                .each(function() {
                    $(this).addClass('selected')
                        .siblings('.selected')
                            .removeClass('selected');
                });
        })(this.find('.etcm-settings__showcase').find('li'));

        return this;
    }

    function setEvent(commands) {
        (function setEventSwitch($switches) {
            $switches
                .change(function() {
                    commands.io(this.checked, $(this).data('command'));
                });
        })(this.find('.toggleSwitch__input'));


        (function setEventSubvalueOFHumbleChoiceTimer($humble_timer_checkbox) {
            $humble_timer_checkbox
                .change(function() {
                    $(this).prev('.etcm-settings__operation > .option').toggle(this.checked);
                })
                .prev('.etcm-settings__operation > .option').children()
                    .first('.etcm-settings__operation .option__timer-design').change(function() {
                        etcm.settings["humble_choice_timer_design"] = $(this).val();
                    })
                    .next('.etcm-settings__operation .option__show-period').change(function() {
                        etcm.settings["humble_choice_show_period"] = $(this).val();
                    });
        })(this.find('#etcm-settings--humble-choice-timer'));

        
        (function setEventLoadingCase($loading_cases) {
            $loading_cases
                .click(function() {
                    $(this) .addClass('selected')
                        .siblings('.selected')
                            .removeClass('selected');

                    etcm.settings.loading_case = $(this).data('loading');
                });
        })($settings.find('.etcm-settings__showcase').find('li'));

        return this;
    }



    var $settings = $(await $.get(await GM.getResourceUrl("etcm-set-layout", "text/html")) );
    $settings.initialize = initialize;
    $settings.setEvent = setEvent;


    $settings.find('.etcm-settings__header__version').text("Ver. "+ GM.info.script.version);
    $settings.find('.etcm-settings__header__save').click(()=> location.reload());
    $settings.find('.etcm-settings__header__reset').click(()=> { 
        etcm.commands = ProxySet("commands", etcm.default_commands, true);
        $settings.initialize(etcm.commands);
    });
    $settings.appendTo(
        $('#body').children().not('script').hide().parent());



    $settings
        .initialize(etcm.commands)
        .setEvent(etcm.commands);
};



$.fn.replaceTag = function (tag) {
    return this.map((_, el) => {
        var subject = $(`<${tag}>`).append($(el).contents());
        subject[0].className = el.className;
        $(el).replaceWith(subject);
        return subject[0];
    });
};

$.fn.nullChk = function() {
    return this.length === 0 ? undefined : this;
};

Array.prototype.diff = function (subject, cmp) {
    return this.filter(each => !subject.some(cmp ? s => cmp(each, s) : each))
}
Array.prototype.coveredTo = function (subject) {
    return subject(this);
}


$(document).on('DOMContentLoaded', function () {
    /* start point */
    let etcm = new ETCM();
    etcm.run();
    console.info("EnhancedITCM running.");
    /*------------*/
});



})( jQuery, window, document);