// ==UserScript==
// @name         enhancedITCM
// @namespace    etcm
// @version      0.1.3
// @description  EnhancedITCM is a user script that enhances the http://itcm.co.kr/
// @author       narci <jwch11@gmail.com>
// @match        *://itcm.co.kr/*
// @icon         https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/icon.png
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/NarciSource/steamCb.js/master/src/exchange.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.1/js/jquery.tablesorter.min.js
// @require      https://raw.githubusercontent.com/NarciSource/steamCb.js/master/src/tablesorter.js
// @resource     etcm-logo https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/logo.png
// @resource     etcm-dft-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/default.css
// @resource     etcm-set-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/settings.css
// @resource     etcm-tgg-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/toggleSwitch.css
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

console.log(`

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


this.$ = window.jQuery.noConflict(true);
/* Add compatibility before greasemonkey version 4 */
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
    console.log(options.type || "GET", options.url);

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



let ProxySet = function(target, arr) {
    /*private*/
    let set,
        save_into_storage = ()=> {
            localStorage[target] = JSON.stringify( Array.from(set) );
        };

    /*public*/
    this.target = target;
    this.has = arg=> set.has(arg);
    this.in = arg=> {
        if (Array.isArray(arg)) {
            arg.forEach(each=> set.add(each));
        } else {
            set.add(arg);
        }
        save_into_storage();
    };
    this.out = arg=> {
        if (Array.isArray(arg)) {
            arg.forEach(each=> set.delete(each));
        } else {
            set.delete(arg);
        }
        save_into_storage();
    };
    this.io = (bool, arg)=> bool? this.in(arg) : this.out(arg);
    this.switch = arg=> this.has(arg)? this.out(arg) : this.in(arg);
    this.clear = ()=> {
        set.clear();
        save_into_storage();
    };
    this.filter = func=> Array.from(set).filter(func);

    /*init*/
    if (localStorage[target]) {
        arr = JSON.parse(localStorage[target]);
    }
    set = new Set(arr);
    save_into_storage();
};






const dynamicstore_url = "https://store.steampowered.com/dynamicstore/userdata/",
      steam_signin_url = "https://store.steampowered.com/login/",
      profile_url = "https://steamcommunity.com/my/ajaxaliases",
      steamstat_url = "https://crowbar.steamstat.us/Barney";



function ETCM() {
    this.settings = new ProxySet("settings", [
        "enhanceLogo",
        "enhanceInfiniteScroll",
        "addFilter",
        "addSteamServerStatusMonitor",
        "addShortcutSide",
        "addArticleBlacklist",
        //"addMemberBlacklist",
        "upgradeProfile",
        "upgradeAppInfoDetails",
        "upgradeGameTagbox",
        "refreshContent",
        "loading--magnify"
    ]);

    this.blacklist = new ProxySet("blacklist", [/*empty*/]);
    this.blacklist_member = new ProxySet("blacklist_mber", [/*empty*/]);
    this.selectTabs;

    this.upgrade = new this.Upgrade(this, {/*empty*/});

    this.$content = $('.bd_lst.bd_tb').children('tbody');
    this.$articles = this.$content.children('tr').not('.notice');



    this.run = ()=> {
        Object.keys(Object.getPrototypeOf(this))
            .filter(property_name=> this.settings.has(property_name))
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


ETCM.prototype.addFilter = function() {
    const etcm = this;

    (function makeBlackTab() {
        $('.cTab').append($('<li>', {
            class: 'etcm-tab__hide',
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

        //add guitar
        $cTab_store.children('span').append(
            $('<a>', {
                href: "/?mid=game_news&search_keyword=기타&search_target=extra_vars2&_sort_index=timer_filter",
                html: $('<img>', {
                        src: "https://openclipart.org/image/800px/svg_to_png/249613/Guitarra.png",
                        css: {width: '29px', height: '29px'}
                    })
            })
        );

        $cTab_store.find('a').each(function() {
            $('<li>', {
                appendTo: $etcm_cTab_store,
                class: 'etcm-tab--store',
                html: $(this).append(
                        $('<span>', {
                            text: /[&|?]search_keyword=([^&]+)/.exec(decodeURI(this.search))[1].toLowerCase()
                        }).hide()
                    )
            });
        });
    }

    let $tabs = $(/*empty*/);
    if (window.location.href.includes("game_news")) {
        $tabs = $('.cTab').children('li').slice(0,4).add('.etcm-tab__hide').add('.etcm-tab--store');
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
                return etcm.selectTabs.has($(this).prev().text().trim());
            },
            change: function() {
                const tab_current_text = $(this).prev().text().trim(),
                      tab_home_text = $tabs.filter('.home').children('a').text();

                if ($(this).is(':checked')) {
                    if (tab_current_text === tab_home_text) {
                        $tabs.children('input').prop('checked',true);
                        etcm.selectTabs.in( Array.from($tabs.children('a').map((_,el)=>$(el).text().trim())) );
                    }

                    etcm.selectTabs.in( tab_current_text );
                } else {
                    if (tab_current_text === tab_home_text) {
                        $tabs.children('input').prop('checked',false);
                        etcm.selectTabs.clear();
                    }

                    $tabs.filter('.home').children('input').prop('checked',false);
                    etcm.selectTabs.out( tab_home_text );

                    etcm.selectTabs.out( tab_current_text );
                }
                etcm.refreshContent();
            }
        });
    });
};


/* infinite scroll */
ETCM.prototype.enhanceInfiniteScroll = function() {
    const etcm = this,
        loading_bar = $('<div>', {
            appendTo: '.btm_mn',
            class: `etcm-loading etcm-${etcm.settings.filter(val=> val.includes("loading"))[0]}`,
        }).hide();

    $(window).scroll(function() {
        if (loading_bar.is(':hidden') && $(window).scrollTop() > $(document).height() - $(window).height() - 50) {
            loading_bar.show();

            $.ajax({
                url: $('.bd_pg').find('.direction').last().attr('href')

            }).then(html=> {
                let $loaded_html = $(html),
                    $loaded_content = $loaded_html.find('.bd_lst.bd_tb').children('tbody'),
                    $loaded_articles = $loaded_content.children('tr').not('.notice');

                $loaded_html.find('.app_image').find('img').each(function() {
                    $(this).attr('src', $(this).data('original') );
                });

                etcm.addMemberBlacklist( $loaded_articles );
                etcm.addArticleBlacklist( $loaded_articles );

                etcm.$content.append( $loaded_articles );
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


/* steam server status monitor */
ETCM.prototype.addSteamServerStatusMonitor = function() {
    $('.column_login').after(
        $('<div>', {
            class: 'column etcm-steam-server-monitor',
            html: $('<div>', {
                        class: 'etcm-steam-server-monitor__title',
                        text: "Steam Server"
                }).add(
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
                                        }
                                );
                            },
                            click: refresh
                        },
                        html: $('<i>', { class: 'fa fa-dashboard' })
                    })
                ).add(
                    $('<ul>', { class: 'etcm-steam-server-monitor__list' })
                ).add(
                    $('<div>', { class: 'etcm-steam-server-monitor__time' })
                )
        })
    );

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

        $('.etcm-steam-server-monitor__time').text(
            `update to: ${s.time.getFullYear()}.${s.time.getMonth()}.${s.time.getDate()} ${s.time.getHours()}:${s.time.getMinutes()}`);

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


/* Show blacklist icon and manage list */
ETCM.prototype.addArticleBlacklist = function($articles) {
    const etcm = this;
    $articles = $articles || this.$articles;

    $articles.addClass('etcm-article')
        .each((_, article)=> {
            $(article).append(
                $('<td>', {
                    class: 'fa fa-eye-slash etcm-blackeye--article',
                    click: function() {
                        const href= $(this).siblings('.title').children('.hx').data('viewer'),
                              document_srl = /document_srl=(\d+)/.exec(href)[1];

                        etcm.blacklist.switch(document_srl);
                        etcm.refreshContent();
                    }
                })
            );
        });
};

ETCM.prototype.addMemberBlacklist = function($articles) {
    const etcm = this;
    $articles = $articles || this.$articles;

    $articles
        .each((_, article)=> {
            $(article).append(
                $('<td>', {
                    class: 'fa fa-eye-slash etcm-blackeye--member',
                    click: function() {
                        const member_id = $(this).siblings('.author').find('a').attr('class');

                        etcm.blacklist_member.switch(member_id);
                        etcm.refreshContent();
                    }
                })
            );
        });
};



/* refresh content */
ETCM.prototype.refreshContent = function() {
    const etcm = this;

    this.$content.children('tr').not('.notice')
        .each((_,article)=> {
            /* parse this article */
            let category = $(article).children('td.cate').children('span').text(),
                href = $(article).children('td.title').children('.hx').data("viewer"),
                document_srl = /document_srl=(\d+)/.exec(href)[1],
                writer_id = $(article).children('td.author').find('a').attr('class'),
                store;

            if (window.location.href.includes("game_news")) {
                $(article).children('td').eq(0).children().children().each(function() {
                    if ($(this).children('img').length) {
                        store= $(this).children('img').attr('title').toLowerCase();
                    } else {
                        store = $(this).text().toLowerCase().trim();
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
            .filter(property_name=> target.settings.has(property_name))
            .map(property_name=> Object.getPrototypeOf(this)[property_name])
            .filter(property=> typeof property === "function")
            .forEach(func => func(this.profileinfo));
    };
};

ETCM.prototype.Upgrade.prototype.upgradeProfile = function(profileinfo) {
    $('.wrap_profile').addClass('etcm-profile');

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



ETCM.prototype.openSettings = async function() {
    const etcm = this;

    $('.inner_content').children().not('script').hide();
    $('.inner_content').append(
        await $.get( await GM.getResourceUrl("etcm-set-layout"))
    );
    $('.etcm-settings__header__version').text("Ver. "+ GM.info.script.version);
    $('.etcm-settings__header__save').click(()=> location.reload());


    $('.etcm-settings__operations').find('.toggleSwitch-input')
        .each(function() {
            $(this).prop('checked', etcm.settings.has( $(this).data('command') ));
        })
        .change(function() {
            etcm.settings.io(this.checked, $(this).data('command'));
        });


    $('.etcm-settings__showcase').find('li')
        .click(function() {
            $(this).addClass('etcm-settings__showcase--selected');
            $(this).siblings().removeClass('etcm-settings__showcase--selected');

            etcm.settings.in( $(this).data('loading') );
            etcm.settings.out( $(this).siblings().map((_,li)=> $(li).data('loading')).toArray() );
        })
        .filter(function() {
            return etcm.settings.has( $(this).data('loading'))
        })
        .each(function() {
            $(this).addClass('etcm-settings__showcase--selected')
        });
}


let etcm = new ETCM();
etcm.run();





/* modify ui */
$('.viewer_with').closest('.bd_hd').prepend(
    $('<a>', {
        css: {
            float: 'right'
        },
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
$('.cTab').css({'margin-bottom': 0});

$('<li>', {
    html: $('<a>', {
        class: 'login_A',
        //href: window.location.pathname+"#etcm_settings",
        text: 'EnhancedITCM설정',
        click: etcm.openSettings.bind(etcm),
        css: {cursor: "pointer"}
    })
}).appendTo($('.wrap_login').children('div'));
