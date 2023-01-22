var Module = {};



;(function ($, window, document, undefined) {


    Module._inspectProtocol = function () {
        /* -! deprecated */
        if (location.protocol === "https:") {
            /* use in https conveniently */
            let meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = "upgrade-insecure-requests";        
            document.head.appendChild(meta);
        }

        if (location.protocol === "http:") {
            throw "HTTPS로의 접근을 권장합니다.";
        }
    }

    Module._initialize = function() {
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


        etcm.$contents = $('table.bd_lst.bd_tb');

        $('.wrap_profile').addClass('etcm-profile');
        window.addEventListener ("load", ()=> $('#scrollUp').addClass('etcm-scrollUp'));

        /* writing button */
        $('body').append($('.btm_mn > .fr > a').isExist()?
            $('<a>', {
                class: 'etcm-writing',
                title: "글 작성하기",
                attr: {
                    href: $('.btm_mn > .fr > a').attr('href')
                },
            })
        :   $()
        );
    }


    Module._preview = function () {
      const etcm = this;

        GM.addStyle([ "default.css", "dark.css" ], { isLink: true, isResource: true });

        $('html').toggleClass('etcm--dark', $.parseJSON(this.settings.dark_mode));

        ;(function sizableBoardSofter(observer) {

            if ($('.xe > .container')[0]) {

                $('.xe').css({ width: etcm.settings["board_width"], margin: '0px auto' })
                $('.xe_width').addClass('etcm-board-width');

                observer?.disconnect();
            }
            else if (observer == undefined) {

                observer = new MutationObserver(()=> sizableBoardSofter(observer));
                observer.observe(document.documentElement, { childList:true, subtree : true });
            }
        })();
    }


    Module._alert = function (event) {
        $('<div>', {
            css: {
                float: 'right', cursor: 'pointer',
                height: '28px', lineHeight: '28px',
            },
            html: $('<marquee>', {
                    scrollamount: 2,
                    html: [
                        $('<i>', {
                            class: 'fa fa-exclamation-circle',
                            css: {
                                color: 'red', opacity: 0.7,
                                paddingRight: '5px'
                            }
                        }),
                        typeof event == 'string'? event : "EnhancedITCM에서 오류가 발생했습니다."
                    ]
            }),
            title: "클릭하면 오류 내용이 복사됩니다.",
            click: function() {
                copyClipboard(event);
                alert(`복사됨 : "${event}"`);
            }
        }).appendTo($('.top_header .account'))
    }


    Module.enhanceLogo = function() {
        (async function newLogo() {
            $('.logo').on('imgSwitch', async function(e) {
                $(this).find('img')
                    .attr({ src: await GM.getResourceUrl(e.url || 'etcm-logo', "image/png") });
            })
            .trigger($.Event('imgSwitch'));
        })();
    };


    /* infinite scroll */
    Module.enhanceInfiniteScroll = function() {
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


                        let condition = ([property, value])=> etcm.recursive_commands[property];
                        etcm.run( condition, $loaded_articles );
                        etcm._loadContent( $loaded_articles );

                        $('.bd_pg').replaceWith($loaded_html.find('.bd_pg'));
                        loading_bar.hide();

                    }).fail(err=> console.warn(err));
                }
            }
        });
    };


    Module.enhanceSizableBoard = function() {
        $('.xe')
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


    Module.enhanceDarkMode = function() {
      const etcm = this;
        $('<div>', {
            id: 'etcm-dark-mode-switch',
            class: 'toggleSwitch',
            html: $('<label>', {
                    class: 'toggleSwitch__label'+($.parseJSON(etcm.settings.dark_mode)? ' on' : ''),
                    html: [
                        $('<div>', {
                            html: [ $('<i>', { class: 'xi-night' }),
                                    $('<i>', { class: 'xi-sun' }) ]
                        }),
                        $('<input>', {
                            type: 'checkbox',
                            class: 'toggleSwitch__input',
                            checked: $.parseJSON(etcm.settings.dark_mode),
                        })
                    ],
                    change: function () {
                        etcm.settings.dark_mode = !$(this).hasClass('on');

                        $(this).toggleClass('on', etcm.settings.dark_mode);

                        $('html').toggleClass('etcm--dark', etcm.settings.dark_mode);

                        $('.logo').trigger($.Event(
                            'imgSwitch', { url: etcm.settings.dark_mode ? 'etcm-dark-logo' : undefined }));
                    }
                })
        }).appendTo($('<li>')).parent().appendTo($('.wrap_login').children('div'));


        $('html').toggleClass('etcm--dark', $.parseJSON(etcm.settings.dark_mode));

        $('.logo').trigger($.Event(
            'imgSwitch', { url: etcm.settings.dark_mode ? 'etcm-dark-logo' : undefined }));
    }



    Module.addHumbleChoiceTimer = function() {
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



      const humbleChoiceEvent = time=> time.clone().tz('America/New_York').startOf('month').nextDay('화요일').hours(13).tz('Asia/Seoul'),
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
    /* !----deprecated----! */
    Module.addSteamServerStatusMonitor = function() {
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
          const steam_server = await GM.ajax(meta.url.steamstat);

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
    Module.addShortcutSide = function() {
        function makeShortcut(fa_icon, text, href) {
            return $('<li>', {
                        class: 'etcm-shortcut',
                        html: [
                                $('<i>', { class: 'fa ' + fa_icon }),
                                $('<a>', { text, href })
                            ]
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


    /* side menu */
    Module._addSideBook = async function() {
        GM.addStyle("side.css", { isLink: true, isResource: true });

      const etcm = this;
        let tabs = etcm.vueRefTabs = Vue.ref({});


        $('.sub_wrap_widget').children().eq(0).after(
            $('#etcm-side').isExist() || $(html = await GM.getResourceText('side.html')).find('#etcm-side')
        );

        etcm.vSideBook = etcm.vSideBook || 
            Vue.createApp({
                data() {
                    return {
                        isCompressed: true,
                        selected: "scrapbook",
                        tabs,
                    }
                },
                methods: {
                    go(url) {
                        window.open(url, '_self')
                    },
                    rotate(e) {
                        $(e.target).animate({ deg: 360 }, {
                            duration: 600,
                            step: function (now) { $(e.target).css({ transform: `rotate(${now}deg)` }) },
                            complete: function () { $(e.target)[0].deg = 0 }
                        });
                    },
                    update(names) {
                        names = (typeof names === "string"? [names] : names);

                        names.forEach(async name => {
                            let spec = this.tabs[name],
                                parsed = spec.parser(await GM.ajax( spec.url ));

                            this.tabs[name].articles = refStorageObject(name, { initial: parsed });
                        });
                    }
                },
                components: {
                    ListItem: {
                        props: {
                            href: String, text: String
                        },
                        template: $(html).find('template').get(0)
                    }
                },
            }).mount('#etcm-side');
    }

    Module.addScrapbook = function() {
        let bookname = "scrapbook";

        this.vueRefTabs.value[bookname] = {
            title: "스크랩",
            url: "/index.php?act=dispMemberScrappedDocument",
            icon: "xi-bookmark",
            parser: html=> $(html).find('.table-striped').find('td.title').children('a')
                        .toArray()
                        .reduce((acc, article)=> ({...acc,
                            [article.pathname]: article.innerText
                        }), {}),
            articles: refStorageObject(bookname)
        };
    };
    Module.addWishbook = function() {
        let bookname = "wishbook";

        this.vueRefTabs.value[bookname] = {
            title: "찜목록",
            url: "/index.php?mid=game_news&_sort_index=check_wlist",
            icon: "xi-cart",
            parser: html=> $(html).find('.bd_lst.bd_tb').children('tbody').children('tr').not('.notice').find('td.title').children('a:even')
                        .toArray()
                        .reduce((acc, article)=> ({...acc,
                            [/document_srl=(\d+)/.exec(article.search)[1]]: article.innerText.trim()
                        }), {}),
            articles: refStorageObject(bookname)
        };
    };
    Module.addPurchasebook = function() {
        let bookname = "purchasebook";

        this.vueRefTabs.value[bookname] = {
            title: "구매목록",
            url: "/index.php?mid=game_news&_sort_index=check_plist",
            icon: "xi-wallet",
            parser: html=> $(html).find('.bd_lst.bd_tb').children('tbody').children('tr').not('.notice').find('td.title').children('a:even')
                        .toArray()
                        .reduce((arr, article)=> ({
                            [/document_srl=(\d+)/.exec(article.search)[1]]: article.innerText.trim()
                        }), {}),
            articles: refStorageObject(bookname)
        };
    };


    Module.addBookmark = async function() {
        let books = Vue.ref(refStorageObject("bookmark"));

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
                                checked: books.value[text],
                                on: {
                                    change: function () {
                                        if (this.checked) {
                                            books.value[text] = href;
                                        } else {
                                            delete books.value[text];
                                        }
                                    }
                                }
                            }),
                            $('<span>')
                        ]
                    })
                );
            });

        let html = await GM.getResourceText('bookmark.html')

        $('.menu_bookmark_remocon').remove();
        $('.right_banner').append($(html));

        Vue.createApp({
            data() {
                return { books }
            },
            methods: {
                plus() {
                    let href = prompt("경로", "https://itcm.co.kr/g_file"), //sample
                        text = prompt("이름", "한글화정보");
                    this.books[text] = href;
                },
                close(text) {
                    delete this.books[text];
                }
            }
        }).mount('.menu_bookmark_remocon');
    }



    Module.addContextMenu = function () {
        $('body').append(
            $('<menu>', {
                type: 'context',
                id: "ContextMenu1",
                html: [
                    $('<menuitem>', {
                        label: '스팀 라이브러리',
                        click: () => window.open(`steam://open/minigameslist`,'_self')
                    }),
                    $('<menuitem>', {
                        label: '스팀 콘솔',
                        click: () => window.open(`steam://open/console`,'_self')
                    })]
            })
        ).attr('contextmenu', "ContextMenu1");



        $('a')
            .filter((_, item) => $(item).attr('href') && $(item).attr('href').includes("steampowered.com/app/"))
            .addClass('steamUrl')
            .each((_, item) => {
              const [match, div, id] = /steampowered\.com\/(\w+)\/(\d+)/.exec(item.href) || [null, null, null];

                $(item).data({ div, id, name: item.text });
            });

        $('a')
            .filter((_, item) => $(item).attr('href') && $(item).attr('href').includes("app="))
            .addClass('itcmGameUrl')
            .each((_, item) => {
              const [match, id] = /app\=(-?\d+)/.exec(item.href) || [null, null];

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
                            window.open(`/index.php?mid=g_board&app=${id}`,'_blank');
                        break;
                    case "itcm_sale":
                        window.open(`/?_filter=search&mid=game_news&search_keyword=${name}&search_target=title_content`,'_blank');
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



    Module._parseArticle = function(article) {
        let fields = [...article.children];

        switch(location.mid) {
            case "community_timeline":
                var [board, cate, title,        game, ...rest] = fields;
            break;
            case "game_news":
                var [store, cate, title, timer, game, ...rest] = fields;
            break;
            case "gift":
                var [       cate, title, timer, game, ...rest] = fields;
            break;
            case "g_board":
                var [       cate, title,        game, ...rest] = fields;
            break;
            default:
                var [       cate, title,              ...rest] = fields;
        }
        var [author, time, readed_count, voted_count, steam_list_check] = rest;

        let id = RegExp(`(?:${location.mid}\/|document_srl=)(\\d+)`).exec(title.children[0].href)[1]*1;

        {
            let titleTag = title;
            title = {
                name: titleTag.children[0].title,
                href: "/"+id
            };
            reply = {
                num: titleTag.children[1].innerText,
                href: "#"+id+"_comment"
            }
        }
        { // store
          const storeSrcs = $('#etcm-cTab--store li').toArray().reduce((acc, cur)=> ({...acc,
                        [cur.title.toLowerCase()]: cur.querySelector('img').src }), {}),
                customRegx = /^\[(.+)\]\s?/;

            let name = store?.querySelector('img')?.title?.toLowerCase(),
                src = storeSrcs[name];

            if (!name) { // Extract custom store name from title
                let customName = customRegx.exec(title.name)?.[1]?.toLowerCase()||"-",
                    customSrc = storeSrcs[customName];

                [name, src] = [customName, customSrc];

                title.name = title.name.replace(customRegx,"");
            }
            store = store? {name, src} : null;
        }

        return {
            id,
            store,
            cate: {
                name: cate.innerText,
            },
            title,
            reply,
            timer: timer
                    ? timer.querySelector('span')?.style.display!=="none"
                        ? timer.querySelector('span > span')?.innerText||" " : " " 
                    : null,
            game: {
                id: /app=(-?\d+)/.exec(game.querySelector('a')?.href)?.[1],
                title: game.querySelector('.header_image')?.title,
                src: game.querySelector('.header_image')?.dataset.original,
            },
            author: {
                id: /member_(\d+)/.exec(author.querySelector('a').className)[1],
                name: author.querySelectorAll('img')[1]?.title,
                src: author.querySelectorAll('img')[1]?.src,
            },
            time: {
                normal: time.innerText,
                detail: time.title
            },
            readed_count: readed_count.innerText,
            voted_count: voted_count.innerText,
        };
    }


    /* load content */
    Module._loadContent = async function($articles) {
      const etcm = this;

        let articles = $articles.toArray().map(etcm._parseArticle),
            doc_list = articles.map(article => article.id);


        /* SteamListcheckLoad */
        if (location.mid === "game_news"){
            check_list = await new Promise((resolve, reject)=> {

                unsafeWindow.exec_json(...unsafeConverter(
                    "steam.dispSteamListcheckLoadAajx",
                    { doc_list },
                    function(ret_obj) {
                        ret_obj = ret_obj.check_list.reduce((prev, { document_srl, type }) => {

                            prev[document_srl] = prev[document_srl] || [];
                            prev[document_srl].push(type);

                            return prev;
                        }, {})

                        resolve(ret_obj);                        
                    }
                ));
            });

            articles.forEach(article => article.type = check_list?.[article.id] || []);
        }

        etcm.vueRefArticles.value = [...etcm.vueRefArticles.value, ...articles];

        $articles.remove()
    };


    Module.designTab = async function() {
      const etcm = this;

        let selectedTabs = etcm.selectedTabs,

            storeTabs = location.mid === "game_news"
                ? Object.entries({
                        ...$('.inner_content').children('div').first().find('a').toArray()
                            .reduce((acc, a) => ({ ...acc, [/search_keyword=(\w+)/.exec(a.href)[1]] : a.children[0].src }), {}),
                        ...meta.icon,
                        "-": null
                    })
                    .map(([title, src]) => ({title, src, href: "/game_news\?search_target=extra_vars2&search_keyword="+title}))
                : [],
            cateTabs = $('.cTab li').toArray()
                .slice(1, location.mid === "game_news"? 4 : undefined) //1: 전체, 4: 할인&무료&번들 진행중
                .map(li => ({
                    title: li.innerText,
                    href: li.children[0].href,
                })),

            fullTabs = [...cateTabs, ...storeTabs].map(t=> t.title);

        // insert dom
        let html = await GM.getResourceText('tab.html');

        if (location.mid === "game_news") {
            $('.inner_content').children('div').first().remove();
            $('.inner_content').prepend( $(html).find('#etcm-cTab--store') );
        }
        $('.bd_lst_wrp').prepend( $(html).find('#etcm-cTab--cate') );
        $('.bd_lst_wrp > .cnb_n_list').remove();

        // components
        var tabList = {
                props: {
                    title: String,
                    selectedTabs: Object
                },
                computed: {
                    checked: {
                        get() {
                            return this.selectedTabs[this.title];
                        },
                        set(checked) {
                            this.selectedTabs[this.title] = checked;
                        }
                    }
                },
                template: $(html).find('#etcm-tab-list').get(0)
            },
            tabExclusiveGboard = {
                computed: {
                    checkedExpired: {
                        get() {
                            return !location.search.includes("timer_filter");
                        },
                        set(checked) {
                            location.href = "/game_news" + (checked? "" : "?_sort_index=timer_filter");
                        }
                    }
                },
                template: $(html).find('#etcm-tab-exclusive-gboard').get(0)
            };

        // store
        Vue.createApp({
            data() {
                return {
                    tabs: storeTabs,
                    selectedTabs,
                }
            },
            components: { tabList }
        }).mount("#etcm-cTab--store");

        // cate
        Vue.createApp({
            data() {
                return {
                    mid: location.mid,
                    tabs: cateTabs,
                    selectedTabs,
                }
            },
            computed: {
                checkedAllTabs: {
                    get() {
                        return fullTabs.every(tab => this.selectedTabs[tab]);
                    },
                    set(value) {
                        fullTabs.forEach(tab => this.selectedTabs[tab] = value);
                    }
                }
            },
            components: { tabList, tabExclusiveGboard }
        }).mount("#etcm-cTab--cate");
    };


    Module.designArticle = async function() {
        const etcm = this;

        switch(location.mid) {
            case "game_news":
                var fields = ['cate', 'title', 'check', 'timer', 'app', 'author_h'];
            break;
            case "gift":
                var fields = ['cate', 'title',          'timer', 'app', 'author_h'];
            break;
            case "community_timeline":
            case "g_board":
            case "b_board":
                var fields = ['cate', 'title',                   'app', 'author_h'];
            break;
            default:
                var fields = ['cate', 'title',                          'author_h'];
        }
        fields = fields.map(key =>
            [key, { cate: "분류", title: "제목", check: "체크", timer: "종료 시각", app: "게임", author_h: "글쓴이" }[key]]);

        let articles = etcm.vueRefArticles = Vue.ref([]),
            blindMembers = refStorageObject("blindMembers"),
            blindArticles = refStorageObject("blindArticles"),
            selectedTabs = etcm.selectedTabs;


        // insert dom
        let html = await GM.getResourceText('article.html'),
            $target = $('table.bd_lst.bd_tb_lst.bd_tb');

        $target.before( $(html).find('#etcm-article-board') );


        // component
        var articleList = {
                props: {
                    id: Number,
                    store: Object, cate: Object, title: Object, timer: String, game: Object, author: Object,
                    reply: Object, author: Object, time: Object, readed_count: String, voted_count: String, type: Array,
                    selectedTabs: Object,
                },
                data() {
                    return {
                        blindArticles, blindMembers,
                        isHoverVote: false,
                        checkedType: this.type,
                    }
                },
                watch: {
                    checkedType(val, old) {
                        let checked = val.length > old.length,
                            [v1, v2] = checked? [val, old] : [old, val],
                            type = v1.filter(v => !v2.includes(v))[0];

                        this.submitCheck(type, checked.toString());
                    }
                },
                computed: {
                    articleClasses() {
                        return {
                            shadow: this.isBlindArticle || this.isBlindMember,
                            check_p: this.checkedType?.includes('p'),
                            check_w: this.checkedType?.includes('w'),
                        };
                    },
                    isBlindArticle() {
                        return this.blindArticles[this.id]? true : false;
                    },
                    isBlindMember() {
                        return this.blindMembers[this.author.id]? true : false;
                    },
                    isShow() {
                        return !this.selectedTabs ||
                        (
                            (
                                this.selectedTabs[this.cate?.name]
                                &&
                                this.selectedTabs[this.store?.name]
                            )
                            &&
                            (
                                this.selectedTabs["eye"]
                                ||
                                (
                                    !this.isBlindArticle && !this.isBlindMember
                                )
                            )
                        );
                    },
                },
                methods: {
                    toggle(subject, id, value) {
                        if (!subject[id]) {
                            subject[id] = value;
                        } else {
                            delete subject[id];
                        }
                    },
                    submitVote() {
                        unsafeWindow.exec_json(...unsafeConverter(
                            "document.procDocumentVoteUp", {
                            target_srl: this.id,
                            cur_mid: location.mid,
                        }));
                    },
                    submitCheck(type, checked) {
                        unsafeWindow.exec_json(...unsafeConverter(
                            "steam.dispSteamListCheckAjax", {
                            doc_srl : this.id,
                            type,
                            checked,
                        }));
                    },
                },
                template: $(html).find('#etcm-article-list').get(0)
            };

        // article board
        Vue.createApp({
            data() {
                return {
                    mid: location.mid,
                    fields, articles,
                    selectedTabs,
                }
            },
            components: { articleList },
        }).mount('#etcm-article-board');

        // load articles
        etcm._loadContent($target.find('tbody tr'));
        $target.remove();
    }



    /* Setting */
    Module.openSettings = async function() {
        GM.addStyle("settings.css", { isLink: true, isResource: true });

      const etcm = this;
        let powerOn = etcm._settingsPowerOn = etcm._settingsPowerOn || Vue.ref(false);


        $('#body').append(
            $('#etcm-settings').isExist() || $(html = await GM.getResourceText('settings.html')).find('#etcm-settings')
        );

        etcm.vSetting = etcm.vSetting ||
            Vue.createApp({
                data() {
                    return {
                        powerOn,
                        version: GM.info.script.version,

                        imex: false,
                        textArea: JSON.stringify(["commands", "g_board_tab", "game_news_tab", "gift_tab"
                                                 ,"blindArticles", "blindMembers", "bookmark", "scrapbook", "wishbook"]
                                        .reduce((acc, val) => ({ ...acc, [val]: loadFromLocalStorage(val) }), { settings: this.settings }), null, 2),

                        normalOperations: {
                            addHumbleChoiceTimer : "Humble Choice 타이머",
                            enhanceInfiniteScroll : "무한 스크롤",
                            designTab : "필터 기능",
                            addWishbook : "개인목록에 찜목록",
                            addPurchasebook : "개인목록에 구입목록",
                            addScrapbook : "개인목록에 스크랩",
                            upgradeGameTagbox : "게임 정보 박스 업그레이드",
                            upgradCBTable : "CBTable 업그레이드",
                            addContextMenu : "게임 링크 컨텍스트 메뉴",
                            enhanceSizableBoard : "게시판 크기 조절",
                        },
                        uiOperations: { designArticle: "게시판 글목록 디자인", },
                        loadingItems: ['puzzle', 'wave', 'squre', 'three', 'magnify', 'text' ],

                        settings: etcm.settings,
                        customCommands: etcm.commands,
                    }
                },
                methods: {
                    save(textArea) {
                        try {
                            Object.entries(JSON.parse(textArea)).forEach(([key, value]) => saveToLocalStorage(key)(value));

                            this.settings = refStorageObject("settings");
                            this.customCommands = refStorageObject("commands");
                        }
                        catch(e) {
                            alert(e);
                        }
                    },
                    reset() {
                        this.customCommands = etcm.commands = refStorageObject("commands", { initial: etcm.default_commands });
                    },
                    copy(value) {
                        copyClipboard(value);
                    }
                },
                components: {
                    operationItem: {
                        props: {
                            command: String,
                            title: String, detail: { type: String, default: ""},
                            customCommands: Object,
                        },
                        computed: {
                            checked: {
                                get() {
                                    return this.customCommands[this.command]
                                },
                                set(checked) {
                                    this.customCommands[this.command] = checked;
                                }
                            },
                        },
                        template: $(html).find('template').get(0)
                    }
                }
            }).mount('#etcm-settings');

        $('#body > .in_body').toggle();
        powerOn.value = !powerOn.value;
    };



    $.fn.replaceTag = function (tag) {
        return this.map((_, el) => {
            var subject = $(`<${tag}>`).append($(el).contents());
            subject[0].className = el.className;
            $(el).replaceWith(subject);
            return subject[0];
        });
    };

    $.fn.isExist = function(arg) {
        if (!arg) {
            return this.length !== 0? this : false;
        } else {
            if (this.length !== 0) {
                var result = new Object(typeof arg === "function"? arg(this) : arg);
                result.else = () => result;
                return result;
            } else {
                this.else = arg => new Object(typeof arg === "function"? arg(this) : arg);
                return this;
            }
        }
    };

    Array.prototype.diff = function (subject, cmp) {
        return this.filter(each => !subject.some(cmp ? s => cmp(each, s) : each))
    }
    Array.prototype.coveredTo = function (subject) {
        return subject(this);
    }


    ;(function enhanceMoment(moment) {
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


    function copyClipboard(value) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(value);
        } else {
            const $text = document.createElement('textarea');
            document.body.appendChild($text);
            $text.value = value;
            $text.select();
            document.execCommand('Copy');
            document.body.removeChild($text);
        }
    }
})( jQuery, window, document);