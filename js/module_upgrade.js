var Upgrade;



;(function ($, window, document, undefined) {
    var Module = {}

    /* Collect information about a user who is currently connected to Steam Web Page. */
    Module._loadProfileInfo = async function(force) {

        let dynamicstore = (force? false : JSON.parse(await loadFromHugeStorage("dynamicstore") || null))
                            ||  await GM.ajax({
                                    responseType: "json",
                                    url: meta.url.dynamicstore,
                                    headers: { 'cache-control':'no-cache, no-store, max-age=0, must-revalidate' }
                                }),

            profile = new XMLParser().parse(await GM.ajax(meta.url.profile) || null)?.profile;

        saveToHugeStorage("dynamicstore")(dynamicstore);

        return [dynamicstore, profile];
    };

    Module.upgradeLogo = function(dynamicstore, profile) {
      const message = {
            0: "connected to : ",
            1: "change account",
            2: "EnhancedITCM. 스팀사이트에 로그인하면 기능이 추가됩니다."
        };

        if (dynamicstore?.rgOwnedApps?.length) {

            message[0] += profile?.steamID;

            $('.logo').append(
                $('<a>', {
                    class: 'etcm-sign',
                    html: $.merge(
                        $('<i>', {
                            class: 'fa fa-sign-in',
                            css: { 'padding-right': '3px' }
                        }),
                        $('<span>', {
                            text: message[tg=0],
                            hover: e => $(e.target).text(message[tg^=1]),
                        })
                    ),
                    click: openLoginWindow
                })
            );
        }
        else {
            $alert = $('<i>', {
                class: 'fa fa-question-circle etcm-blink',
                title: message[2],
                css: {
                    fontSize: 'small',
                    position: 'absolute', right: 0,
                    cursor: 'pointer',
                },
                click: openLoginWindow
            });

            $('.logo').prepend( $alert.clone(true) );
            $('.cb-table').prepend( $alert.clone(true) );
            $('.app_info_details').prepend( $alert.clone(true) );
            $('.steam_read_selected').prepend( $alert.clone(true) );
        }

        that = this;

        function openLoginWindow () {
            let win = window.open(meta.url.steam_signin + "?redir=account", "Login", "width=300, height=400");
            let iv = setInterval(async ()=> {
                    if (win.closed) {

                        that._loadProfileInfo(true).then(that._run);
                        clearInterval(iv);
                        location.reload();
                    }
                }, 1000);
        }
    }

    Module.upgradeProfile = async function(dynamicstore, profile) {

        document.addStyle( [ meta.css.miniprofile ] );


      const magic = 76561197960265728n;

        let accountID = profile?.steamID64? BigInt(profile?.steamID64+"") - magic : 0,

            mini_profile = await GM.ajax({
                responseType: "json",
                url: `https://steamcommunity.com/miniprofile/${accountID}/json`,
                headers: { 'cache-control':'no-cache, no-store, max-age=0, must-revalidate' }
            });

        if (mini_profile) {

            $('.login_PlayoutA')
                .append(
                    $('<fieldset>', {
                        id: 'etcm-mini-profile',
                        html: await $.get( meta.html.miniprofile ),
                    }))
                .append(
                    $('<i>', {
                        class: 'fa fa-star',
                        click: e => {
                            $(e.target).animate({ rotate: '360deg' }, 1000, ()=> $(e.target).css('rotate','0deg'));
                            $('.login_PlayoutA').flip('toggle');
                            this.target.settings.show_miniprofile = !JSON.parse(this.target.settings.show_miniprofile||null);
                        },
                    })
                );


            Vue.createApp({
                data() {
                    return { profile, mini_profile }
                }
            }).mount('#etcm-mini-profile');


            $('.login_PlayoutA').find('fieldset')
                .first().addClass('front')
                .next().addClass('back');
            $('.login_PlayoutA').flip({ trigger: 'manual' }).flip(JSON.parse(this.target.settings.show_miniprofile||null));
        }
    };

    Module.upgradeAppInfoDetails = function(dynamicstore) {
        $('.app_info_details').each( function() {
            let pathname = $(this).children('.wrap_info').find('.app_name').get(0).pathname,
                [_, div, id] = /\/(\w+)\/(\d+)/.exec(pathname);
            id = Number(id);

            if (dynamicstore.rgOwnedApps.includes(id)) {
                $(this).children('.h2_widget_sub').each(function() {
                    $(this).text( $(this).text() + " (보유중)" );
                });
            }
        });
    };

    Module.upgradeGameTagbox = function(dynamicstore) {
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
                            $('<td>', { class: 'hangul' }),
                            $('<td>', { class: 'wm' }),
                            $('<td>', { class: 'p' })
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
          const [match, div, id] = /steampowered\.com\/(\w+)\/(\d+)/.exec($app.find('.item_content .name').attr('href'));
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

                    if ((div === "app" && dynamicstore.rgOwnedApps.includes(id))
                        || (div === "package" && dynamicstore.rgOwnedPackages.includes(id))) {
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

                    if (dynamicstore.rgWishlist.includes(id)) {
                        $(app).addClass('etcm-wishApp');
                    }

                    if (Object.keys(dynamicstore.rgIgnoredApps).includes(String(id))) {
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

    Module.upgradeCBTable = function(dynamicstore) {
        document.addStyle([ meta.css.tablesorter ]); 

      const regx = /^[\w\s]+\((\d+)\%\)/;
        let $cbTable = $('.cb-table');


        $th = $cbTable.find('th');
        ratings_idx = $th.index($th.filter((_, th) => th.innerText == "Ratings"));

        $cbTable.tablesorter({
            textSorter : {
                [ratings_idx] : (a, b) => (regx.exec(a)?.[1] || 0) - (regx.exec(b)?.[1] || 0)
            }
        });


        $cbTable.find('tbody tr')
            .each(function () {
              const href = $(this).find('a').attr('href');
                let [match, div, id] = /steampowered\.com\/(\w+)\/(\d+)/.exec(href||null) || [null];
                id = Number(id);


                if ((div === "app"      && dynamicstore.rgOwnedApps.includes(id))
                ||  (div === "package"  && dynamicstore.rgOwnedPackages.includes(id))) {
                    $(this)
                        .attr('title', "보유 게임")
                        .css('opacity', 0.3);
                }

                if (dynamicstore.rgWishlist.includes(id)) {
                    $(this).children().first()
                        .append($('<i>', {
                            class: 'fa fa-shopping-cart',
                            title: "찜한 게임",
                            css: { 'margin-left': '5px' }
                        }));
                }
            });
    };


    /* Procedures that require dynamicstore. */
    Upgrade = function(target) {
        this.target = target;
        this._run = arg => {
            Object.entries(Object.getPrototypeOf(this))
                .filter(([property, value])=> target.commands[property] && typeof value === "function")
                .forEach(([property, func])=> func.apply(this, arg));
        };

        this.run = ()=> this._loadProfileInfo().then(this._run);
    };

    Upgrade.prototype = Module;

})( jQuery, window, document);