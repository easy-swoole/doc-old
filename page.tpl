<!DOCTYPE html>
<html lang="en">
<head>
    <link href="/Css/page.css" rel="stylesheet">
    <link href="https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <script src="/Js/jquery-2.0.3.min.js" type="text/javascript"></script>
    {$HEAD}
</head>
<body>
<div class="book with-summary without-animation" id="book-main">
    <div class="book-summary">
        <div id="book-search-input" role="search">
            <input type="text" placeholder="搜索功能即将来袭 ^_^">
        </div>
        <nav role="navigation">
            <ul class="summary">
                {$MENU}
            </ul>
        </nav>
    </div>

    <div class="book-body">
        <div class="body-inner">
            <div class="page-wrapper">
                <div class="book-header" role="navigation">
                    <a class="btn pull-left js-toolbar-action" aria-label="" href="#" id="toggleSidebar"><i
                                class="fa fa-align-justify"></i></a>
                    <a class="btn pull-right js-toolbar-action" aria-label="" href="#"><i class="fa fa-flag"></i>&nbsp;&nbsp;VERSION
                        3.0</a>
                </div>
                <div class="page-inner">
                    <div class="book-search-results">
                        <div class="search-noresults">
                            <section class="normal markdown-section">{$PAGE}</section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>

    // 设备尺寸监测
    var platform = {
        isMobile: function () {
            return ($(document).width() <= 600);
        },
        // Breakpoint for navigation links position
        isSmallScreen: function () {
            return ($(document).width() <= 1240);
        }
    };

    // 侧边栏切换
    var sidebarElem = $('.book-summary');
    var mainBox = $('#book-main');

    // 侧边栏管理
    var sidebar = {
        toggleSidebar: function (state) {
            state ? mainBox.addClass('with-summary') : mainBox.removeClass('with-summary');
        },
        isOpen: function () {
            return mainBox.hasClass('with-summary');
        },
        initSidebar: function () {
            platform.isMobile() ? sidebar.toggleSidebar(false) : sidebar.toggleSidebar(true);

            // 切换边栏状态
            $('#toggleSidebar').on('click', function () {
                sidebar.toggleSidebar(!sidebar.isOpen())
            });

            // 响应式自动切换
            $(window).resize(function () {
                sidebar.toggleSidebar(!platform.isMobile())
            });
        }
    };

    // 章节目录管理
    var expanded = {
        init: function () {
            $('.articles').parent('.chapter').children('a').on('click', function (e) {
                e.preventDefault();
                expanded.toggle($(e.target).closest('.chapter'));
            }).append(
                $('<i class="exc-trigger fa"></i>')
            );

            expanded.expand(expanded.lsItem());
            expanded.collapse($('.chapter'));

            // 展开当前菜单
            var url = '/' + window.location.href.split('/').slice(3).join('/'); 
            url = url.substring(0, url.indexOf('.html')+5);
            expanded.expand($("a[href='" +url+"']").parents('li'));
            $("a[href='" +url+"']").parents('li').addClass('active');
        },
        toggle: function ($chapter) {
            if ($chapter.hasClass('expanded')) {
                expanded.collapse($chapter);
            } else {
                expanded.expand($chapter);
            }
        },
        collapse: function ($chapter) {
            if ($chapter.length && $chapter.hasClass('expanded')) {
                $chapter.removeClass('expanded');
                expanded.lsItem($chapter);
            }
        },
        expand: function ($chapter) {
            if ($chapter.length && !$chapter.hasClass('expanded')) {
                $chapter.addClass('expanded');
                expanded.lsItem($chapter);
            }
        },
        lsItem: function () {
            var map = JSON.parse(localStorage.getItem('expChapters')) || {};
            if (arguments.length) {
                var $chapters = arguments[0];
                $chapters.each(function (index, element) {
                    var level = $(this).data('level');
                    var value = $(this).hasClass('expanded');
                    map[level] = value;
                });
                localStorage.setItem('expChapters', JSON.stringify(map));
            } else {
                return $('.chapter').map(function (index, element) {
                    if (map[$(this).data('level')]) {
                        return this;
                    }
                })
            }
        }
    };
    // 初始化侧栏
    sidebar.initSidebar();
    // 初始化章节目录
    expanded.init();
</script>

</body>
</html>
