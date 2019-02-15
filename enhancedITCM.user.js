// ==UserScript==
// @name         enhancedITCM
// @namespace    etcm
// @version      0.1.2-1
// @description  EnhancedITCM is a user script that enhances the http://itcm.co.kr/
// @author       narci <jwch11@gmail.com>
// @match        *://itcm.co.kr/*
// @icon         https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/icon.png
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/NarciSource/steamCb.js/master/src/exchange.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.1/js/jquery.tablesorter.min.js
// @require      https://raw.githubusercontent.com/NarciSource/steamCb.js/master/src/tablesorter.js
// @resource     etcm-logo https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/img/logo.png
// @resource     etcm-style https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/css/default.css
// @updateURL    https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/enhancedITCM.meta.js
// @downloadURL  https://raw.githubusercontent.com/NarciSource/enhancedITCM/master/enhancedITCM.user.js
// @grant        GM.getResourceUrl
// @grant        GM.xmlHttpRequest
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
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
        xmlHttpRequest : GM_xmlhttpRequest
    };
}

/* load style */
async function addStyle(resource_url) {
    $("<link>", {
        rel : "stylesheet",
        type : "text/css",
        href : await GM.getResourceUrl(resource_url)
    }).appendTo("head");
};
addStyle("etcm-style");

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

let ProxySet = function(target, arr) {
    /*private*/
    let set,
        save_into_storage = ()=> {
            localStorage[target] = JSON.stringify( Array.from(set) );
        };

    /*public*/
    this.add = arg=> {
        if (Array.isArray(arg)) {
            arg.forEach(each=>set.add(each));
        } else {
            set.add(arg);
        }
        save_into_storage();
    }
    this.delete = arg=> {
        set.delete(arg);
        save_into_storage();
    }
    this.clear = ()=> {
        set.clear();
        save_into_storage();
    }
    this.has = arg=> set.has(arg);

    /*init*/
    target = target;
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



let $content = $('.bd_lst.bd_tb').children('tbody'),
    $articles = $content.children('tr').not('.notice'),
    blacklist = new ProxySet("blacklist", [/*empty*/]),
    blacklist_member = new ProxySet("blacklist_mber", [/*empty*/]),
    selectTabs,
    profileinfo;





/* enhance logo */
(async function enhanceLogo() {
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
        localStorage.removeItem('profileinfo');
    }
    else {
        $('.logo').append(
            $('<a>', {
                class: 'etcm-sign',
                html: $.merge(
                    $('<i>', { class: 'fa fa-refresh'}),
                    $('<span>', { text: ` working : ${signin_name}`})
                ),
                click: loadProfileInfo
            })
        );

        profileinfo = localStorage["profileinfo"]?
                    JSON.parse(localStorage["profileinfo"]) : loadProfileInfo();
    }
})();


/* steam server status monitor */
(function steamServerStatusMonitor() {
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
})();


/* Provide useful shortcuts related to this game. */
(function shortcutSide() {
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
})();



/* Collect information about a user who is currently connected to Steam Web Page. */
async function loadProfileInfo() {
    let profileinfo = await GM.ajax({
                            dataType: "json",
                            url: dynamicstore_url,
                        });
    if (profileinfo === undefined || profileinfo.rgOwnedApps.length === 0) {
        console.error("Steam account is strange...");
    }
    localStorage["profileinfo"] = JSON.stringify( profileinfo );

    enhanceGametagbox( profileinfo );
    enhanceProfile( profileinfo );
    enhanceAppInfoDetails( profileinfo );
};

function enhanceProfile(profileinfo) {
    $('.wrap_profile').addClass('etcm-profile');

    //$('.wrap_profile').append($('<div>', {
    //    text: `게임 수집 : ${profileinfo.rgOwnedApps.length}`
    //}))
}

function enhanceAppInfoDetails(profileinfo) {
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
}

function enhanceGametagbox(profileinfo) {
    $('.steam_read_selected').each(function() {
        if ($(this).find('.mi_app_live').length === 0) {
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

            $(this).find('tbody')
                .append( makeLine(" 미보유 게임"))
                .append( makeLine(" 보유 게임"));
        }

        $(this).find('.no_mi_app, .mi_app')
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

        const $that = $(this);
        $(this).find('.mi_app_live')
            .css({cursor: 'pointer'})
            .on({
                click: function() {
                    if ($(this).text().trim() === "미보유 게임") {
                        $that.find('.no_mi_app').toggle();
                    }
                    if ($(this).text().trim() === "보유 게임") {
                        $that.find('.mi_app').toggle();
                    }
                }
            })
    });
}



/* Show blacklist icon and manage list */
function giveIdBlackArticle($articles) {
    $articles.addClass('etcm-article')
        .each((_, article)=> {
            $(article).append(
                $('<td>', {
                    class: 'fa fa-eye-slash etcm-blackeye--article',
                    click: function() {
                        const href= $(this).siblings('.title').children('.hx').attr('href'),
                                document_num = /(\d+)$/.exec(href)[1];

                        if (blacklist.has(document_num)) {
                            blacklist.delete(document_num);
                        } else {
                            blacklist.add(document_num);
                        }
                        refreshContent();
                    }
                })
            );
        });
};

function giveIdBlackMemeber($articles) {
    $articles
        .each((_, article)=> {
            $(article).append(
                $('<td>', {
                    class: 'fa fa-eye-slash etcm-blackeye--member',
                    click: function() {
                        const member_id = $(this).siblings('.author').find('a').attr('class');

                        if (blacklist_member.has(member_id)) {
                            blacklist_member.delete(member_id);
                        } else {
                            blacklist_member.add(member_id);
                        }
                        refreshContent();
                    }
                })
            );
        });    
}



/* enhance tab */
(function makeBlackTab() {
    $('.cTab').append($('<li>', {
        class: 'etcm-tab__hide',
        html : $('<a>', {
            class: 'fa fa-eye-slash',
            html: $('<span>', { text: "black" }).hide()
        })
    }))
})();

(function enhanceTab() {
    if (window.location.href.includes("game_news") &&
        $('.inner_content').children('div').eq(0).find('img').attr('src').includes("/store/")
    ) {
        const $cTab_store = $('.inner_content').children('div').eq(0),
              $etcm_cTab_store =
                $('<ul>', {
                    appendTo: $cTab_store,
                    class: 'etcm-cTab--store',
                    css: {display: 'flex'}
                });

        $cTab_store.find('a').each(function() {
            $('<li>', {
                appendTo: $etcm_cTab_store,
                class: 'etcm-tab--store',
                html: $(this).append(
                        $('<span>', {
                            text: /search_keyword=(\w+)/.exec($(this).attr('href'))[1].toLowerCase()
                        }).hide()
                    )
            });
        });

        //add guitar
        $('<li>', {
            appendTo: $etcm_cTab_store,
            class: 'etcm-tab--store',
            html: $('<a>', {
                    href: "http://itcm.co.kr/?_filter=search&act=&vid=&mid=game_news&search_keyword=기타&search_target=extra_vars2&_sort_index=timer_filter",
                    html: $.merge(
                        $('<img>', {
                            src: "https://openclipart.org/image/800px/svg_to_png/249613/Guitarra.png",
                            css: {width: '29px', height: '29px'}
                        }),
                        $('<span>', {
                            text: "기타"
                        }).hide()
                    )
                })
        });
    }



    let $tabs = $(/*empty*/);
    if (window.location.href.includes("game_news")) {
        $tabs = $('.cTab').children('li').slice(0,4).add('.etcm-tab__hide').add('.etcm-tab--store');
        selectTabs = new ProxySet("game_news_tab", $tabs.children('a').map((_,el)=>$(el).text().trim()) );
    }
    if (window.location.href.includes("g_board")) {
        $tabs = $('.cTab').children('li');
        selectTabs = new ProxySet("g_board_tab", $tabs.children('a').map((_,el)=>$(el).text().trim()) );
    }

    $tabs.each((_, li)=>{
        let $tab = $(li).addClass('etcm-tab');

        $('<input>', {
            appendTo: $tab,
            type: 'checkbox',
            checked: function() {
                return selectTabs.has($(this).prev().text().trim());
            },
            change: function() {
                const tab_current_text = $(this).prev().text().trim(),
                      tab_home_text = $tabs.filter('.home').children('a').text();

                if ($(this).is(':checked')) {
                    if (tab_current_text === tab_home_text) {
                        $tabs.children('input').prop('checked',true);
                        selectTabs.add( Array.from($tabs.children('a').map((_,el)=>$(el).text().trim())) );
                    }

                    selectTabs.add( tab_current_text );
                } else {
                    if (tab_current_text === tab_home_text) {
                        $tabs.children('input').prop('checked',false);
                        selectTabs.clear();
                    }

                    $tabs.filter('.home').children('input').prop('checked',false);
                    selectTabs.delete( tab_home_text );

                    selectTabs.delete( tab_current_text );
                }
                refreshContent();
            }
        });
    });
})();


/* infinite scroll */
(function infiniteScroll() {
    let loading_bar = $('<img>', {
            class: 'etcm-loading-bar',
            src: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtYnJpY2tzIiBzdHlsZT0iYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwKSBub25lIHJlcGVhdCBzY3JvbGwgMCUgMCU7Ij48cmVjdCBuZy1hdHRyLWZpbGw9Int7Y29uZmlnLmMxfX0iIG5nLWF0dHIteD0ie3tjb25maWcueH19IiBuZy1hdHRyLXk9Int7Y29uZmlnLnh9fSIgbmctYXR0ci13aWR0aD0ie3tjb25maWcud319IiBuZy1hdHRyLWhlaWdodD0ie3tjb25maWcud319IiBuZy1hdHRyLXJ4PSJ7e2NvbmZpZy5yYWRpdXN9fSIgbmctYXR0ci1yeT0ie3tjb25maWcucmFkaXVzfX0iIGZpbGw9IiNiYjNkM2MiIHg9IjE1IiB5PSIxNSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiByeD0iMyIgcnk9IjMiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9IngiIGNhbGNNb2RlPSJsaW5lYXIiIHZhbHVlcz0iMTU7NTU7NTU7NTU7NTU7MTU7MTU7MTU7MTUiIGtleVRpbWVzPSIwOzAuMDgzOzAuMjU7MC4zMzM7MC41OzAuNTgzOzAuNzU7MC44MzM7MSIgZHVyPSIyIiBiZWdpbj0iLTEuODMzMzMzMzMzMzMzMzMzM3MiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ieSIgY2FsY01vZGU9ImxpbmVhciIgdmFsdWVzPSIxNTs1NTs1NTs1NTs1NTsxNTsxNTsxNTsxNSIga2V5VGltZXM9IjA7MC4wODM7MC4yNTswLjMzMzswLjU7MC41ODM7MC43NTswLjgzMzsxIiBkdXI9IjIiIGJlZ2luPSItMS4zMzMzMzMzMzMzMzMzMzMzcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT48L3JlY3Q+PHJlY3QgbmctYXR0ci1maWxsPSJ7e2NvbmZpZy5jMn19IiBuZy1hdHRyLXg9Int7Y29uZmlnLnh9fSIgbmctYXR0ci15PSJ7e2NvbmZpZy54fX0iIG5nLWF0dHItd2lkdGg9Int7Y29uZmlnLnd9fSIgbmctYXR0ci1oZWlnaHQ9Int7Y29uZmlnLnd9fSIgbmctYXR0ci1yeD0ie3tjb25maWcucmFkaXVzfX0iIG5nLWF0dHItcnk9Int7Y29uZmlnLnJhZGl1c319IiBmaWxsPSIjNDg2OThkIiB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgcng9IjMiIHJ5PSIzIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJ4IiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjE1OzU1OzU1OzU1OzU1OzE1OzE1OzE1OzE1IiBrZXlUaW1lcz0iMDswLjA4MzswLjI1OzAuMzMzOzAuNTswLjU4MzswLjc1OzAuODMzOzEiIGR1cj0iMiIgYmVnaW49Ii0xLjE2NjY2NjY2NjY2NjY2NjdzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InkiIGNhbGNNb2RlPSJsaW5lYXIiIHZhbHVlcz0iMTU7NTU7NTU7NTU7NTU7MTU7MTU7MTU7MTUiIGtleVRpbWVzPSIwOzAuMDgzOzAuMjU7MC4zMzM7MC41OzAuNTgzOzAuNzU7MC44MzM7MSIgZHVyPSIyIiBiZWdpbj0iLTAuNjY2NjY2NjY2NjY2NjY2NnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+PC9yZWN0PjxyZWN0IG5nLWF0dHItZmlsbD0ie3tjb25maWcuYzN9fSIgbmctYXR0ci14PSJ7e2NvbmZpZy54fX0iIG5nLWF0dHIteT0ie3tjb25maWcueH19IiBuZy1hdHRyLXdpZHRoPSJ7e2NvbmZpZy53fX0iIG5nLWF0dHItaGVpZ2h0PSJ7e2NvbmZpZy53fX0iIG5nLWF0dHItcng9Int7Y29uZmlnLnJhZGl1c319IiBuZy1hdHRyLXJ5PSJ7e2NvbmZpZy5yYWRpdXN9fSIgZmlsbD0iI2ZkYzc2YyIgeD0iMTUiIHk9IjE1IiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHJ4PSIzIiByeT0iMyI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ieCIgY2FsY01vZGU9ImxpbmVhciIgdmFsdWVzPSIxNTs1NTs1NTs1NTs1NTsxNTsxNTsxNTsxNSIga2V5VGltZXM9IjA7MC4wODM7MC4yNTswLjMzMzswLjU7MC41ODM7MC43NTswLjgzMzsxIiBkdXI9IjIiIGJlZ2luPSItMC41cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJ5IiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjE1OzU1OzU1OzU1OzU1OzE1OzE1OzE1OzE1IiBrZXlUaW1lcz0iMDswLjA4MzswLjI1OzAuMzMzOzAuNTswLjU4MzswLjc1OzAuODMzOzEiIGR1cj0iMiIgYmVnaW49IjBzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPjwvcmVjdD48L3N2Zz4=",
        }).hide().appendTo('.btm_mn');

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

                giveIdBlackMemeber( $articles );
                giveIdBlackArticle( $loaded_articles );

                $content.append( $loaded_articles );
                $(document).find('.bd_pg').remove();
                $(document).find('.bd_lst_wrp').append( $loaded_html.find('.bd_pg') );

                loading_bar.hide();
                refreshContent();
            }).fail(err=> {
                console.log(err);
            });
        }
    });
})();



giveIdBlackMemeber($articles);
giveIdBlackArticle($articles);
refreshContent();



/* refresh content */
function refreshContent() {
    $content.children('tr').not('.notice')
        .each((_,article)=> {
            /* parse this article */
            let category = $(article).children('td.cate').children('span').text(),
                href = $(article).children('td.title').children('.hx').attr('href'),
                document_num = /(\d+)$/.exec(href)[1],
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
            if (blacklist.has(document_num) || blacklist_member.has(writer_id)) {
                $(article).addClass('etcm-article--shadow');
            }
            else {
                $(article).removeClass('etcm-article--shadow');
            }

            /* Determine whether this article is visible or not. */
            if (
                !selectTabs ||
                (
                    (
                        !category || selectTabs.has(category)
                    )
                    &&
                    (
                        !store || selectTabs.has(store)
                    )
                    &&
                    (
                        !document_num || selectTabs.has("black") 
                        || 
                        !(
                            blacklist.has(document_num) || blacklist_member.has(writer_id)
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