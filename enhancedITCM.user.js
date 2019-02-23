// ==UserScript==
// @name         enhancedITCM
// @namespace    etcm
// @version      0.1.6-2
// @description  EnhancedITCM is a user script that enhances the http://itcm.co.kr/
// @author       narci <jwch11@gmail.com>
// @match        *://itcm.co.kr/*
// @icon         https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/icon.png
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/NarciSource/steamCb.js/master/src/exchange.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.1/js/jquery.tablesorter.min.js
// @require      https://raw.githubusercontent.com/NarciSource/steamCb.js/master/src/tablesorter.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/locale/ko.js
// @require      https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/vendor/TimeCircles.js
// @resource     etcm-logo https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/logo.png
// @resource     etcm-dft-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/default.css
// @resource     etcm-set-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/settings.css
// @resource     etcm-tgg-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/toggleSwitch.css
// @resource     etcm-tc-style https://cdnjs.cloudflare.com/ajax/libs/timecircles/1.5.3/TimeCircles.min.css
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
    GM = this.GM = this.GM || {
        getResourceUrl : url=> {
            const res = GM_getResourceURL(url).replace("data:text/plain; charset=utf-8","data:text/css; base64");
            return Promise.resolve(res);
        },
        xmlHttpRequest : GM_xmlhttpRequest,
        setValue : GM_setValue,
        getValue : arg=> Promise.resolve(GM_getValue(arg)),
        deleteValue : GM_deleteValue
    };
}

/* The A-C-A-O problem should be avoided, making the gm.xmlHttpRequest as convenient as jQuery.ajax */
GM.ajax = function(url, options) {
    options = options || {url};
    if ( typeof url === "object" ) {
        options = url;
    }
    console.info(options.type || "GET", options.url);

    let dfd = $.Deferred();

    GM.xmlHttpRequest( $.extend( {}, options, {
        method: "GET",
        onload: response => {
            const headerRegex = /([\w-]+): (.*)/gi,
                  mimeRegex = /(^\w+)\/(\w+)/g;

            let headers = {}, match;
            while( match = headerRegex.exec(response.responseHeaders) ) {
                headers[ match[1].toLowerCase() ] = match[2].toLowerCase();
            }

            const [mime, mime_type, mime_subtype] = mimeRegex.exec( headers["content-type"] );
            switch(mime_subtype) {
                case "xml":
                    dfd.resolve( new DOMParser().parseFromString( response.responseText, mime ) );
                    break;
                case "json":
                    dfd.resolve( JSON.parse(response.responseText) );
                    break;
            }
            dfd.resolve(response.responseText);
        },
        onerror: error => dfd.reject(error)
    }));

    return dfd.promise();
};



/* load style */
async function addStyle(resource_url) {
    $("<link>", {
        rel : "stylesheet",
        type : "text/css",
        href : await GM.getResourceUrl(resource_url)
    }).appendTo("head");
};
addStyle("etcm-dft-style");
addStyle("etcm-set-style");
addStyle("etcm-tgg-style");
addStyle("etcm-tc-style");



class ProxySet extends Set {
    constructor(storage_name, arr, force) {
        arr = force? arr : localStorage[storage_name]? JSON.parse(localStorage[storage_name]) : arr;

        super(arr);
        this.storage_name = storage_name;

        this._saveIntoStorage();
        return this;
    }
    _saveIntoStorage() {
        localStorage[ this.storage_name ] = JSON.stringify( Array.from(this) );
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
        return Array.from(this).filter(func);
    }
}

function ProxyObject(obj, force) {
    $.each(obj, (key, val)=> {
        if (force || !localStorage[key]) localStorage[key] = val;
        else obj[key] = localStorage[key];
    });
    
    return new Proxy(obj, {
        get(target, key, receiver) {
            if (!Reflect.has(target, key, receiver)) {
                return localStorage[key];
            }
            return Reflect.get(target, key, receiver);
        },
        set(target, key, val, receiver) {
            localStorage[key] = val;
            return Reflect.set(target, key, val, receiver);
        }
    });
}




const dynamicstore_url = "https://store.steampowered.com/dynamicstore/userdata/",
      steam_signin_url = "https://store.steampowered.com/login/",
      profile_url = "https://steamcommunity.com/my/ajaxaliases",
      steamstat_url = "https://crowbar.steamstat.us/Barney";



function ETCM() {
    this.default_commands = [
        "_initializeArticle",

        "enhanceLogo",
        "enhanceInfiniteScroll",

        "addFilter",
        "addSteamServerStatusMonitor",
        "addHumbleMontlyTimer",
        "addShortcutSide",
        "addArticleBlacklist",
        //"addMemberBlacklist",
        "addScrapbook",
        //"addWishbook",

        "upgradeProfile",
        "upgradeAppInfoDetails",
        "upgradeGameTagbox",

        "modifyProfileToCircle",
        "modifyHideBadge",
        "modifyDateGroup",
        "modifyShortlyVote",
        "modifyWishCheck",

        "refreshContent",
    ];
    this.recursive_commands = [
        "_initializeArticle",

        "addMemberBlacklist",
        "addArticleBlacklist",

        "modifyProfileToCircle",
        "modifyHideBadge",
        "modifyDateGroup",
        "modifyShortlyVote",
        "modifyWishCheck"
    ];
    this.default_settings = {
        humble_mothly_show_period: -1, //always
        loading_case: "magnify"
    }

    moment.locale('ko');

    if (localStorage["etcm-version"] !== GM.info.script.version) { //update
        localStorage["etcm-version"] = GM.info.script.version;
        this.commands = new ProxySet("commands", this.default_commands, true);
        this.settings = ProxyObject(this.default_settings, true);
    } else {
        this.commands = new ProxySet("commands", this.default_commands, false);
        this.settings = ProxyObject(this.default_settings, false);
    }
    this.blacklist = new ProxySet("blacklist", [/*empty*/]);
    this.blacklist_member = new ProxySet("blacklist_mber", [/*empty*/]);
    this.selectTabs;

    this.upgrade = new this.Upgrade(this, {/*empty*/});

    this.$contents = $('table.bd_lst.bd_tb');
    this.$articles = this.$contents.children('tbody').children('tr');


    this.run = ()=> {
        Object.keys(Object.getPrototypeOf(this))
            .filter(property_name=> this.commands.has(property_name))
            .map(property_name=> Object.getPrototypeOf(this)[property_name])
            .filter(property=> typeof property === "function")
            .forEach(func=> func.apply(this));
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
    GM.setValue("profileinfo", JSON.stringify( profileinfo ));
    return profileinfo;
};


ETCM.prototype._initializeArticle = function($articles) {
    $articles = $articles || this.$articles;

    $articles.addClass('etcm-article')
        .each(function() {
            var href = $(this).hasClass('notice')? 
                            $(this).children('.title').children('a').get(0).href
                            : $(this).children('.title').children('.hx').data('viewer'),
                document_srl = /(?:\/g_board\/|\/game_news\/|document_srl=)(\d+)/.exec(href)[1];
            $(this).data({document_srl});
        });
}



ETCM.prototype.enhanceLogo = async function() {
    const signin_name = (await GM.ajax(profile_url))[0].newname;

    $('.logo').find('img')
            .attr({src: await GM.getResourceUrl('etcm-logo')})
            .css({width:'110px'})

    if (signin_name === undefined) {
        $('.logo').append(
            $('<a>', {
                class: 'etcm-sign',
                css: {color: 'red'},
                text: "sign in",
                href: steam_signin_url
            })
        );
        GM.deleteValue("profileinfo");
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
                    this.profileinfo = await this._loadProfileInfo();
                    this.upgrade.set( this.profileinfo ).run();
                }
            })
        );
        this.profileinfo = await GM.getValue("profileinfo")? JSON.parse( await GM.getValue("profileinfo")) : await this._loadProfileInfo();
        this.upgrade.set( this.profileinfo ).run();
    }
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
            loading_bar.show();

            $.ajax({
                url: $('.bd_pg').find('.direction').last().attr('href')

            }).then(html=> {
                let $loaded_html = $(html),
                    $loaded_content = $loaded_html.find('.bd_lst.bd_tb').children('tbody'),
                    $loaded_articles = $loaded_content.children('tr').not('.notice').addClass('etcm-article');

                $loaded_html.find('.app_image').find('img').each(function() {
                    $(this).attr('src', $(this).data('original') );
                });



                etcm.$contents.children('tbody').append( $loaded_articles );

                etcm.recursive_commands
                    .filter(func_name => etcm.commands.has(func_name))
                    .forEach(func_name => etcm[func_name]( $loaded_articles ));

                repeatModifyUI( $loaded_articles );


                $(document).find('.bd_pg').remove();
                $(document).find('.bd_lst_wrp').append( $loaded_html.find('.bd_pg') );

                loading_bar.hide();
                etcm.refreshContent();
            }).fail(err=> {
                console.warn(err);
            });
        }
    });
};



ETCM.prototype.addHumbleMontlyTimer = function() {
    function addTimer({title, class_name, date, humble_href, board_href}) {
        return $('<div>', {
            class: 'etcm-timer '+class_name,
            html: $.merge(
                $('<div>', {
                    class: 'etcm-timer__title',
                    html: [
                        $('<a>', {
                            class: 'etcm-timer__title__text',
                            text: title,
                            href: humble_href
                        }),
                        $('<a>', {
                            class: 'etcm-timer__title__redirect fa fa-tag',
                            href: board_href,
                            toggle: board_href!==undefined
                        }),
                        $('<p>', {
                            class: 'etcm-timer__title__time',
                            text: date.format("MMMM Do(dddd) h:mm")
                        })
                    ]                
                }),
                $('<div>', {
                    class: 'etcm-timer__dashboard',
                    data: {
                        timer: date.diff(moment(), 'seconds')
                    }
                })
            )}).toggle( date.diff(moment(), 'seconds')>0 );
    }

    /* HumbleMontly release  first   saturday   3 o'clock   of every month */
    const firstSaturday = {'date':1, 'day':6, 'hours':3, 'minutes':0, 'seconds':0, 'milliseconds':0},

          releaseDate = moment().set(firstSaturday).isAfter(moment())?
                    moment().set(firstSaturday)
                  : moment().add(1,'month').set(firstSaturday),
          autoSubscribeDate = releaseDate.clone().subtract(7,'days');

    if (this.settings.humble_mothly_show_period !== -1
        && this.settings.humble_mothly_show_period < releaseDate.diff(moment(), 'days')) {
        return;
    }


    $('<div>', { class: 'column etcm-humble-monthly-timer' })
        .insertAfter( $('aside.e1').children('.column_login') )

        .append( addTimer({ title: "Humble Montly", class_name: 'release-monthly', date: releaseDate,
                            board_href: "/?_filter=search&mid=game_news&search_keyword=humble+monthly&search_target=title",
                            humble_href: "https://www.humblebundle.com/monthly/checkout?selected_plan=monthly_basic"}))
        .append( addTimer({ title: "자동 결제일", class_name: 'auto-subscribe', date: autoSubscribeDate,
                            humble_href: "https://www.humblebundle.com/user/cancel-subscription"}))

    .find('.etcm-timer__dashboard')
        .TimeCircles({
            count_past_zero: false,
            total_duration: "Auto",
            bg_width: 3.2,
            fg_width: 0.02,
            number_size: 0.2,
            text_size: 0.13,
            circle_bg_color: '#FFF',
            time: {
                Days: {
                    text: "일", color: 'cadetblue'
                },
                Hours: {
                    text: "시", color: '#bb3d3d'
                },
                Minutes: {
                    text: "분", color: '#48698d'
                },
                Seconds: {
                    text: "초", color: '#fdc76c'
                }
            }
        });
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

    (function makeBlackTab() {
        $('.cTab').append($('<li>', {
            class: 'etcm-tab--hide',
            html : $('<a>', {
                class: 'fa fa-eye-slash',
                html: $('<span>', { text: "black" }).hide()
            })
        }))
    })();

    if (window.location.href.includes("game_news") &&
        $('.inner_content').children('div').eq(0).find('img').attr('src').includes("/store/")
    ) {
        let $cTab_store = $('.inner_content').children('div').eq(0),
            $etcm_cTab_store =
                $('<ul>', {
                    appendTo: $cTab_store,
                    class: 'etcm-cTab--store',
                    css: {display: 'flex'}
                });

        $cTab_store.find('a').each(function() {
            const store_name = /[&|?]search_keyword=([^&]+)/.exec(decodeURI(this.search))[1];
            $('<li>', {
                appendTo: $etcm_cTab_store,
                class: 'etcm-tab--store',
                title: store_name,
                html: $(this).append(
                        $('<span>', {
                            text: store_name.toLowerCase()
                        }).hide()
                    )
            });
        });

        function addStoreFilter({store_name, img_src, width, height}) {
            img_src = img_src || `https://placeholdit.imgix.net/~text?txtsize=15&txtclr=000000&bg=ffffff&txt=${store_name}&w=80&h=50&txttrack=0`;
            width = width || '29px';
            height = height || '29px';

            $('<li>', {
                appendTo: $etcm_cTab_store,
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
        }
        function removeStoreFilter(store_name) {
            $etcm_cTab_store.find('span').filter((_,el)=> el.innerText === store_name)
                .closest('.etcm-tab--store').remove();
        }

        addStoreFilter({store_name: "Chronogg", img_src: "https://www.chrono.gg/assets/images/branding/chrono-icon--dark.9b6946b4.png"});
        addStoreFilter({store_name: "WinGameStore", img_src: "https://www.wingamestore.com/images/s2/logo-icon.png"});
        addStoreFilter({store_name: "Nuuvem", img_src: "https://assets.nuuvem.com/assets/fe/images/nuuvem_logo-ab61ec645af3a6db7df0140d4792f31a.svg"});
        addStoreFilter({store_name: "MicrosoftStore", img_src: "https://c.s-microsoft.com/en-us/CMSImages/Microsoft_Corporate_Logo_43_42.jpg?version=77D1E093-019E-5C72-083F-4DF9BF1362F5"});        
        addStoreFilter({store_name: "DailyIndieGame", width: '50px'});
        addStoreFilter({store_name: "OtakuBundle", width: '50px'});
        addStoreFilter({store_name: "GoGoBundle", width: '50px'});
        addStoreFilter({store_name: "기타", img_src: "https://openclipart.org/image/800px/svg_to_png/249613/Guitarra.png"});
        removeStoreFilter("gamethor");
    }

    let $tabs = $(/*empty*/);
    if (window.location.href.includes("game_news")) {
        $tabs = $('.cTab').children('li').slice(0,4).add('.etcm-tab--hide').add('.etcm-tab--store');
        etcm.selectTabs = new ProxySet("game_news_tab", $tabs.children('a').map((_,el)=>$(el).text().trim()) );
    }
    if (window.location.href.includes("g_board")) {
        $tabs = $('.cTab').children('li');
        etcm.selectTabs = new ProxySet("g_board_tab", $tabs.children('a').map((_,el)=>$(el).text().trim()) );
    }

    $tabs.each((_, li)=>{
        let $tab = $(li).addClass('etcm-tab');

        $('<input>', {
            appendTo: $tab,
            type: 'checkbox',
            checked: function() {
                const chk = etcm.selectTabs.has($(this).prev().text().trim());
                if (chk) {
                    $(this).parent().addClass('check');
                }
                return chk;
            },
            change: function() {
                const tab_current_text = $(this).prev().text().trim(),
                      tab_home_text = $tabs.filter('.home').children('a').text();

                if ($(this).is(':checked')) {
                    if (tab_current_text === tab_home_text) {
                        $tabs.children('input').prop('checked', true)
                            .parent().addClass('check');

                        etcm.selectTabs.in( Array.from($tabs.children('a').map((_,el)=>$(el).text().trim())) );
                    }

                    $(this).parent().addClass('check');

                    etcm.selectTabs.in( tab_current_text );                    
                } else {
                    if (tab_current_text === tab_home_text) {
                        $tabs.children('input').prop('checked', false)
                            .parent().removeClass('check');

                        etcm.selectTabs.clear();
                    }

                    $tabs.filter('.home').children('input').prop('checked', false)
                        .parent().removeClass('check');
                    $(this).parent().removeClass('check');

                    etcm.selectTabs.out( tab_home_text );

                    etcm.selectTabs.out( tab_current_text );
                }
                etcm.refreshContent();
            }
        });
    });
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
ETCM.prototype.addScrapbook = async function() {
    let $scrapbook = $('<div>', { class: 'etcm-side__book' })
            .append($('<h2>', {text: "스크랩"}))
            .append($('<i>', {class: 'fa fa-compress'}))
            .append($('<i>', {class: 'fa fa-refresh'}))
            .append($('<ul>', {class: 'etcm-side__book__list'})),
        scrapbook = new ProxySet("scrapbook", []);
    $('.sub_wrap_widget').children().eq(0).after($scrapbook);


    if (scrapbook.size === 0) {
        await loadScrapbook();
    }
    refresh();


    $scrapbook.children('h2')
        .click(()=> window.location.replace("http://itcm.co.kr/index.php?act=dispMemberScrappedDocument"));
    $scrapbook.children('.fa-refresh')
        .click(async()=> { await loadScrapbook(); refresh(); });
    $scrapbook.children('.fa-compress')
        .click(function() { $(this).siblings('.etcm-side__book__list').toggleClass('etcm-side__book__list--collapse') });

    if (scrapbook.size < 12) {
        $scrapbook.children('.fa-compress').hide();
    } else {
        $scrapbook.children('.fa-compress').show();
    }



    async function loadScrapbook() {
        let html = await GM.ajax("http://itcm.co.kr/index.php?act=dispMemberScrappedDocument"),
            list = $(html).find('.table-striped').find('td.title').children('a')
                        .map((_, article)=> {
                            return {
                                text: article.innerText,
                                href: article.pathname
                            };
                        }).toArray();

        scrapbook.clear();
        scrapbook.in( list );
    }
    function refresh() {
        $scrapbook.find('li').remove();
        scrapbook.forEach(({text, href})=> {
            $('<li>', {
                class: 'etcm-side__book__list__article',
                html: $('<a>', {
                    href,
                    html: $.merge(
                        $('<img>', {src: "/widgets/treasurej_popular/skins/DW_Portal/img/docu.gif"}),
                        $('<span>', {text})
                    )
                })
            }).appendTo($scrapbook.children('ul'));
        });
    }
};

ETCM.prototype.addWishbook = async function() {
    let $wishbook = $('<div>', { class: 'etcm-side__book' })
            .append($('<h2>', {text: "찜목록"}))
            .append($('<i>', {class: 'fa fa-compress'}))
            .append($('<i>', {class: 'fa fa-refresh'}))
            .append($('<ul>', {class: 'etcm-side__book__list'})),
        wishbook = new ProxySet("wishbook", []);
    $('.sub_wrap_widget').children().eq(0).after($wishbook);


    if (wishbook.size === 0) {
        await loadwishbook();
    }
    refresh();


    $wishbook.children('h2')
        .click(()=> window.location.replace("http://itcm.co.kr/index.php?mid=game_news&_sort_index=check_wlist"));
    $wishbook.children('.fa-refresh')
        .click(async()=> { await loadwishbook(); refresh(); });
    $wishbook.children('.fa-compress')
        .click(function() { $(this).siblings('.etcm-side__book__list').toggleClass('etcm-side__book__list--collapse') });


    if (wishbook.size < 12) {
        $wishbook.children('.fa-compress').hide();
    } else {
        $wishbook.children('.fa-compress').show();
    }



    async function loadwishbook() {
        let html = await GM.ajax("http://itcm.co.kr/index.php?mid=game_news&_sort_index=check_wlist"),
            list = $(html).find('.bd_lst.bd_tb').children('tbody').children('tr').not('.notice').find('td.title').children('a:even')
                        .map((_, article)=> {
                            const href = article.search;
                            return {
                                text: article.innerText.trim(),
                                href: /document_srl=(\d+)/.exec(href)[1]
                            };
                        }).toArray();

        wishbook.clear();
        wishbook.in( list );
    }
    function refresh() {
        $wishbook.find('li').remove();
        wishbook.forEach(({text, href})=> {
            $('<li>', {
                class: 'etcm-side__book__list__article',
                html: $('<a>', {
                    href,
                    html: $.merge(
                        $('<img>', {src: "/widgets/treasurej_popular/skins/DW_Portal/img/docu.gif"}),
                        $('<span>', {text})
                    )
                })
            }).appendTo($wishbook.children('ul'));
        });
    }
};



/* refresh content */
ETCM.prototype.refreshContent = function() {
    const etcm = this;

    this.$articles
        .each((_,article)=> {
            /* parse this article */
            let category = $(article).children('td.cate').text().trim(),
                document_srl = $(article).data('document_srl'),
                writer_id = $(article).children('td.author').find('a').attr('class'),
                store;

            if (window.location.href.includes("game_news")) {
                $(article).children('td').eq(0).children().children().each(function() {
                    if ($(this).children('img').length) {
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
ETCM.prototype.Upgrade = function(target, profileinfo) {
    this.profileinfo = profileinfo;

    this.set = profileinfo=> {
        this.profileinfo = profileinfo;
        return this;
    };

    this.run = ()=> {
        Object.keys(Object.getPrototypeOf(this))
            .filter(property_name=> target.commands.has(property_name))
            .map(property_name=> Object.getPrototypeOf(this)[property_name])
            .filter(property=> typeof property === "function")
            .forEach(func => func(this.profileinfo));
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
    $('.steam_read_selected').each(function() {
        const $tagbox = $(this);

        if ($tagbox.find('.mi_app_live').length === 0) {
            const makeLine = (text) =>
                $('<tr>', {
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

            $tagbox.find('tbody')
                .append( makeLine(" 미보유 게임"))
                .append( makeLine(" 보유 게임"));
        }

        $tagbox.find('.no_mi_app, .mi_app')
            .each((_,app)=> {
                let [match, div, id] = /steampowered\.com\/(\w+)\/(\d+)/.exec(
                    $(app).find('.item_content .name').attr('href')
                );
                id = Number(id);

                if ((div === "app" && !profileinfo.rgOwnedApps.includes(id))
                    || (div === "package" && !profileinfo.rgOwnedPackages.includes(id))) {
                    $(app).removeClass('mi_app')
                            .addClass('no_mi_app')
                            .siblings('.mi_app_live').eq(0).after($(app));
                }
                if ((div === "app" && profileinfo.rgOwnedApps.includes(id))
                    || (div === "package" && !profileinfo.rgOwnedPackages.includes(id))) {
                    $(app).removeClass('no_mi_app')
                            .addClass('mi_app')
                            .siblings('.mi_app_live').eq(1).after($(app));
                }

                if (profileinfo.rgWishlist.includes(id)) {
                    $(app).addClass('etcm-wishApp');
                }

                if (Object.keys(profileinfo.rgIgnoredApps).includes(String(id))) {
                    $(app).addClass('etcm-ignoreApp');
                }
            });

        $tagbox.find('.mi_app_live')
            .css({cursor: 'pointer'})
            .on({
                click: function() {
                    if ($(this).text().trim() === "미보유 게임") {
                        $tagbox.find('.no_mi_app').toggle();
                    }
                    if ($(this).text().trim() === "보유 게임") {
                        $tagbox.find('.mi_app').toggle();
                    }
                }
            })
    });
};



/* modify ui */
ETCM.prototype.modifyProfileToCircle = function($articles) {
    $articles = $articles || this.$articles;

    $articles.children('.author').css({'text-align':'left', 'max-width':'75px', 'text-overflow':'clip'})
        .find('img').filter(':odd').each((_,el)=> {
            $(el).css({'border-radius':'50px','width':'23px','height':'23px'})
                .parent().contents().last().get(0).textContent = " "+$(el).attr('title');
        });
};

ETCM.prototype.modifyHideBadge = function($articles) {
    $articles = $articles || this.$articles;
    $articles.find('.xe_point_level_icon').remove();
};


ETCM.prototype.modifyDateGroup = function($articles) {
    const etcm = this;
    $articles = $articles || etcm.$articles;

    $articles.not('.notice').each((_, el)=> {
        const cur_text = $(el).children('.time').text()
              prev_text = $(el).prev().children('.time').text();

        if (/\d+\.\d+/.test( cur_text ) && cur_text != prev_text ) {
            $(el).before(
                $('<tr>', {
                    class: 'etcm-article--empty',
                    html: $('<td>', { text: cur_text })
                })
            )
        }
    });

    $('th.regdate, .notice td.time').remove();
    $articles.children('.time').remove();
};


ETCM.prototype.modifyShortlyVote = function($articles) {
    const etcm = this;
    $articles = $articles || this.$articles;

    const entry = etcm.$contents.find('th').length,
          index = etcm.$contents.find('th').index( etcm.$contents.find('.voted_count') );

    $articles.children(`:nth-child(${entry}n+${index+1})`)
        .addClass('vote')
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
    $articles = $articles || etcm.$articles;

    $articles.find('.steam_list_check')
        .find('label').children().hide()
        .closest('label').filter(':even').append(
            $('<i>', { class: 'fa fa-credit-card' })
        ).next().append(
            $('<i>', { class: 'fa fa-shopping-cart' })
        );
};



/* Setting */
ETCM.prototype.openSettings = async function() {
    const etcm = this;

    function initialize(commands) {
        $settings.find('.toggleSwitch__input')
            .each(function() {
                $(this).prop('checked', commands.has( $(this).data('command') ));
            });

        $('#etcm-settings--humble-montly-timer').each(function() {
            $(this).prev('select').toggle( commands.has( $(this).data('command')) );
        })
        .prev('select').val( etcm.settings["humble_mothly_show_period"] );


        $settings.find('.etcm-settings__showcase').find('li')
            .filter(function() {
                return $(this).data('loading') === etcm.settings.loading_case;
            })
            .each(function() {
                $(this).addClass('selected')
                    .siblings('.selected')
                        .removeClass('selected');
            });
    }

    function event(commands) {
        $settings.find('.toggleSwitch__input')
            .change(function() {
                commands.io(this.checked, $(this).data('command'));
            });

        $('#etcm-settings--humble-montly-timer').change(function() {
            $(this).prev('select').toggle(this.checked);
        })
        .prev('select').change(function() {
            etcm.settings["humble_mothly_show_period"] = $(this).val();
        });


        $settings.find('.etcm-settings__showcase').find('li')
            .click(function() {
                $(this) .addClass('selected')
                    .siblings('.selected')
                        .removeClass('selected');

                etcm.settings.loading_case = $(this).data('loading');
            });
    }

    var $settings = $( await $.get( await GM.getResourceUrl("etcm-set-layout")) );

    $('.inner_content').children().not('script').hide().parent().append( $settings );

    $settings.find('.etcm-settings__header__version').text("Ver. "+ GM.info.script.version);
    $settings.find('.etcm-settings__header__save').click(()=> location.reload());
    $settings.find('.etcm-settings__header__reset').click(()=> { 
        etcm.commands = new ProxySet("commands", etcm.default_commands, true);
        initialize(etcm.commands);
    });

    initialize(etcm.commands);
    event(etcm.commands);
};


let etcm = new ETCM();
etcm.run();






/* modify ui */
(function modifyUI() {
    if (window.location.href.includes("game_news")) {
        $('.viewer_with').closest('.bd_hd')
            .css({display:'flex', 'align-items':'center', 'justify-content':'space-between'})
            .prepend(
                $('<a>', {
                    css: {'margin-left':'auto'},
                    href: "/index.php?mid=game_news&_sort_index=timer_filter&act=dispBoardWrite",
                    html: $.merge(
                        $('<b>', {
                            class: 'ico_16px write'
                        }),
                        $('<span>', {
                            text: "쓰기"
                        })
                    )
                })
            )
            .prepend(
                $('.bd_srch_btm').clone()
                        .addClass('on')
                    .children('.itx_wrp').css({width: '200px'})
                    .parent()
            );
    }

    $('.cTab').css({'margin-bottom': 0});

    $('<li>', {
        html: $('<a>', {
            class: 'login_A',
            text: 'EnhancedITCM설정',
            click: etcm.openSettings.bind(etcm),
            css: {cursor: "pointer"}
        })
    }).appendTo($('.wrap_login').children('div'));

    $(window).on('load',function() {
        $('.wrap_profile').addClass('etcm-profile');
        $('#scrollUp').addClass('etcm-scrollUp');
    });
})();

function repeatModifyUI($articles) {
    $articles.find('.hx').each((_, el)=> $(el).text($(el).attr('title')));
}
repeatModifyUI( etcm.$articles );


})( jQuery, window, document);