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
        etcm.$articles = etcm.$contents.children('tbody').children('tr');

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

    Module._initializeArticle = function($articles) {
        $articles = $articles || this.$articles;

        $articles
            .addClass('etcm-article')
            .each(function() {
                var href = $(this).hasClass('notice')? 
                                $(this).children('.title').children('a').get(0).href
                                : $(this).children('.title').children('.hx').data('viewer'),
                    mid = /mid=(\w+)/.exec(location.search)?.[1] || location.pathname.replace(/\/\d+/,""),
                    document_srl = RegExp(`(?:${mid}\/|document_srl=)(\\d+)`).exec(href)[1];
                $(this).data({document_srl});
            });
    }



    Module._preview = function () {
      const etcm = this;

        document.addStyle( [ meta.css.default, meta.css.dark ] );

        $('html').toggleClass('etcm--dark', $.parseJSON(this.settings["dark_mode"]));

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
        function copyClipboard(value) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(value);
            }
            else {
                const $text = document.createElement('textarea');
                document.body.appendChild($text);
                $text.value = value;
                $text.select();
                document.execCommand('Copy');
                document.body.removeChild($text);
            }
        }

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


    Module.addFilter = function() {
      const etcm = this;

        (function handleGamenewsTabs() {
            if (!window.location.href.includes("game_news")
            ||  !$('.inner_content').children('div').first().not('.xe-widget-wrapper').isExist()) {
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
    Module.addArticleBlacklist = function($articles) {
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

    Module.addMemberBlacklist = function($articles) {
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
      const $side = $('.etcm-side').isExist() ? $('.etcm-side')
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

    Module.addScrapbook = async function() {
        addSideBook({
            name: "scrapbook",
            title: "스크랩",
            url: "/index.php?act=dispMemberScrappedDocument",
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
    Module.addWishbook = async function() {
        addSideBook({
            name: "wishbook",
            title: "찜목록",
            url: "/index.php?mid=game_news&_sort_index=check_wlist",
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
    Module.addPurchasebook = async function() {
        addSideBook({
            name: "purchasebook",
            title: "구매목록",
            url: "/index.php?mid=game_news&_sort_index=check_plist",
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


    Module.addBookmark = function() {
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
                                        refresh();
                                    }
                                }
                            }),
                            $('<span>')
                        ]
                    })
                );
            });

        if (bookmark.size && !$('.menu_bookmark_remocon').isExist()) {
            $('<div>', {
                class: 'menu_bookmark_remocon',
                html: [
                    $('<h2>', { text: "즐겨찾기" }),
                    $('<ul>')
                ]
            }).appendTo('.right_banner');
        }

        $('.menu_bookmark_remocon').find('h2').append(
            $('<i>', {
                class: 'fa fa-plus',
                css: {cursor: 'pointer'},
                click: () => {
                    bookmark.in({//sample
                        href: prompt("경로", "https://itcm.co.kr/g_file"),
                        text: prompt("이름", "한글화정보")
                    });
                    refresh();
                }
            })
        );


        function refresh() {
            $('.menu_bookmark_remocon').find('ul').html(
                [...bookmark].map(({ href, text }) =>
                    $('<li>', {
                        html: [":: ",
                            $('<a>', { href, text }),
                            $('<i>', {
                                class: 'fa fa-close',
                                css: {cursor: 'pointer'},
                                click: () => {
                                    bookmark.out({ href, text });
                                    refresh();
                                }
                            })
                        ]
                    }))
            );
        };

        refresh();
    }



    Module.addContextMenu = function () {
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



    /* refresh content */
    Module.refreshContent = function($articles) {
      const etcm = this;
        $articles = $articles || etcm.$articles;

        $articles
            .each((_,article)=> {
                /* parse this article */
                let $article = $(article),
                    category = $article.find('.cate').text().trim(),
                    document_srl = $article.data('document_srl'),
                    writer_id = $article.find('.author').find('a').attr('class'),
                    title = $article.find('.title').children('a.hx').title,
                    store = $article.find('.store').find('img').isExist(o => o.attr('title')).else(o => o.prevObject.text()).toLowerCase().trim().replace("-","")


                /* If this article is a blacklist then shadow. */
                if (etcm.blacklist.has(document_srl) || etcm.blacklist_member.has(writer_id)) {
                    $article.addClass('etcm-article--shadow');
                }
                else {
                    $article.removeClass('etcm-article--shadow');
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
                    $article.show();
                } else {
                    $article.hide();
                }
            });
    };


    /* modify ui */
    Module.modifyArticle = function($articles) {
      const etcm = this;
        $articles = $articles || this.$articles;
        $contents = this.$contents;

        if (!$contents.hasClass('etcm-article-design')) {
            $contents.addClass('etcm-article-design');

            let $th = $contents.find('th'),
                categories = ['cate', 'title', 'app_image', 'author_h', 'regdate', 'readed_count', 'voted_count', 'steam_list_check'];

            if (location.href.includes("game_news")) {
                categories.splice(0,0,'location');
                categories.splice(3,0,'expire');
                categories.splice(9,0,'steam_list_check');

                $th.eq('.title').after($th.eq('.steam_list_check'));
            }
            if (location.href.includes("timeline")) {
                categories.splice(0,0,'location');
            }

            categories.forEach((c, i) => $th.eq(i).addClass(c));
        }


        $articles.each((_,article) => {

            let $article = $(article),
                $store = location.href.includes("game_news")? $article.children('.m_no').first().addClass('store').replaceTag('div') : $(),
                $mid = $article.find('.mid').replaceTag('div'),
                $cate = $article.find('.cate').replaceTag('div'),
                $time = $article.find('.time').replaceTag('span'),
                $list_timer = $article.find('.list_timer').parent().replaceTag('td'),
                $title = $article.find('.title').replaceTag('div'),
                $replyNum = $article.find('.replyNum').detach(),
                $readed_count = $article.children('.m_no').last().prev().replaceTag('span').addClass('readed_count'),
                $voted_count = $article.children('.m_no').last().replaceTag('span').addClass('voted_count'),
                $app_image = $article.find('.app_image').replaceTag('td'),
                $author = $article.find('.author').detach(),
                $steam_list_check = $article.children('.steam_list_check');


            $author.find('a').contents().last()[0].textContent = $author.find('img').not('.xe_point_level_icon').attr('title');

            $article.html([
                $('<td>', { class: 'sect', html:
                    [ $store, $mid, $cate ]
                }),
                $('<td>', { class: 'post', html:
                    [ $time, $title, $replyNum, $readed_count, $voted_count ]
                }),
                $steam_list_check,
                $list_timer,
                $app_image,
                $author
            ]);
        });
        etcm.refreshContent();
    };


    Module.modifyShortlyVote = function($articles) {
      const etcm = this;
        $articles = $articles || etcm.$articles;

      const entry = etcm.$contents.find('th').length,
            index = etcm.$contents.find('th').index( etcm.$contents.find('.voted_count') );

    ($articles.find('.voted_count').isExist()
    ||
    $articles.children(`:nth-child(${entry}n+${index + 1})`).addClass('vote_count'))
            .each((_, el)=> {
                $(el).html($('<i>', { html: $(el).html() }))
                    .hover(function() {
                        $(this).children().toggleClass('fa fa-heart') })
                    .click(function() {
                        unsafeWindow.jQuery.exec_json('document.procDocumentVoteUp', {
                            target_srl: $(el).closest('.etcm-article').data('document_srl'),
                            cur_mid: /mid=(\w+)/.exec(location.search)[1],
                            vars1: undefined
                        });
                    });
            });
    };


    Module.modifyWishCheck = function($articles) {
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


    Module.modifyOthers = function($articles) {
      const etcm = this;
        $articles = $articles || etcm.$articles;


        (function fixAppImageFading($app_img) {
            $app_img.find('img').each(function() {
                $(this).attr('src', $(this).data('original') );
            });
        })($articles.find('.app_image'));


        (function fixTitleFading($hx) {
            $hx.filter((_, el)=> $(el).attr('title'))
            .each((_, el)=> $(el).text($(el).attr('title')));
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
    Module.openSettings = async function() {
      const etcm = this;

        document.addStyle([ meta.css.settings ]);

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


        function importSettingOptions($textarea) {
            if ($textarea?.val()) {

                Object.entries(
                    JSON.parse($textarea.val())

                ).forEach(([key, value])=> saveToLocalStorage(key)(value));
            }
        }
        function exportSettingOptions($textarea) {

            $textarea.val(
                JSON.stringify(
                    [...Object.keys(etcm.default_settings), "commands", "g_board_tab", "game_news_tab", "blacklist", "blacklist_mber", "bookmark", "scrapbook"]
                        .reduce((acc, val) => ({ ...acc, [val]: loadFromLocalStorage(val) }), {})
                    ,null, 2)
                );
        }



        var $settings = $(await $.get(await GM.getResourceUrl("etcm-set-layout", "text/html")) );
        $settings.initialize = initialize;
        $settings.setEvent = setEvent;
        $settings.importSettingOptions = importSettingOptions;


        $settings.find('.etcm-settings__header__version').text("Ver. "+ GM.info.script.version);
        $settings.find('.etcm-settings__header__imex').click(()=> {
            $settings.find('.etcm-settings__body').hide();
            $settings.find('.etcm-settings__imex').show();
            exportSettingOptions($settings.find('.etcm-settings__imex > textarea'));
        });
        $settings.find('.etcm-settings__header__save').click(()=> {
            try {
                $settings.importSettingOptions($settings.find('.etcm-settings__imex > textarea'));
                location.reload();
            }
            catch(e) {
                alert(e);
            }
        });
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

    $.fn.isExist = function(arg) {
        if (!arg) {
            return this.length !== 0? this : false;
        }
        else {
            if (this.length !== 0) {
                var result = new Object(typeof arg === "function"? arg(this) : arg);
                result.else = () => result;
                return result;
            }
            else {
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


})( jQuery, window, document);