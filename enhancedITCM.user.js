// ==UserScript==
// @name         enhancedITCM
// @namespace    etcm
// @version      0.1
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
      profile_url = "https://steamcommunity.com/my/ajaxaliases",
      steamstat_url = "https://crowbar.steamstat.us/Barney";



let $content = $('.bd_lst.bd_tb').children('tbody'),
    $articles = $content.children('tr').not('.notice'),
    blacklist = new ProxySet("blacklist", [/*empty*/]),
    selectTabs;






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
                href: "https://steamcommunity.com/login/home/?goto="
            })
        );
    }
    else {
        $('.logo').append(
            $('<a>', {
                class: 'etcm-sign',
                html: $.merge(
                    $('<i>', { class: 'fa fa-refresh'}),
                    $('<span>', { text: ` working : ${signin_name}`})
                ),
                href: "https://store.steampowered.com/#clear_cache"
            })
        );
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
(async function loadProfileInfo() {
    var profileinfo = localStorage["profileinfo"]?
                        JSON.parse(localStorage["profileinfo"])
                      : await GM.ajax({
                            dataType: "json",
                            url: dynamicstore_url,
                        });
    localStorage["profileinfo"] = JSON.stringify( profileinfo );

    enhanceGametagbox( profileinfo );
    enhanceProfile( profileinfo );
    enhanceAppInfoDetails( profileinfo );
})();

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
                    class: 'fa fa-eye-slash',
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
                    class: 'etcm-cTab--store'
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
                            src: "https://openclipart.org/image/800px/svg_to_png/249613/Guitarra.png"
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
    let loading = true;
    $(window).scroll(function() {
        if (loading && $(window).scrollTop() > $(document).height() - $(window).height() - 50) {
            loading = false;

            $.ajax({
                url: window.location.origin + $('.bd_pg').find('.direction').last().attr('href')

            }).done(html=> {
                let $loaded_html = $(html),
                    $loaded_content = $loaded_html.find('.bd_lst.bd_tb').children('tbody'),
                    $loaded_articles = $loaded_content.children('tr').not('.notice');

                $loaded_html.find('.app_image').find('img').each(function() {
                    $(this).attr('src', $(this).data('original') );
                })

                giveIdBlackArticle( $loaded_articles );

                $content.append( $loaded_articles );
                $(document).find('.bd_pg').remove();
                $(document).find('.bd_lst_wrp').append( $loaded_html.find('.bd_pg') );
                

                loading = true;
                refreshContent();
            });
        }
    });
})();



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
            if (blacklist.has(document_num)) {
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
                        !document_num || selectTabs.has("black") || !blacklist.has(document_num)
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