<!DOCTYPE html>
<html lang="en">
<head>
    <link href="/Css/page.css" rel="stylesheet">
    <link href="https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <script src="https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="/Js/jquery.mark.min.js"></script>
    {$HEAD}
</head>
<body>
<div class="book with-summary without-animation" id="book-main">
    <div class="book-summary">
        <div id="book-search-input" role="search">
            <input type="text" placeholder="搜索功能已上线 ^_^">
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
                        <!-- 搜索功能新增 -->
                        <div class="search-results">
                            <div class="has-results">
                                <h1 class="search-results-title"><span class="search-results-count">0</span> results matching "<span class="search-query"></span>"</h1>
                                <ul class="search-results-list"></ul>
                            </div>
                            <div class="no-results">
                                <h1 class="search-results-title">No results matching "<span class="search-query"></span>"</h1>
                            </div>
                        </div>
                        <!-- 搜索功能新增结束 -->
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
                e.target.href != undefined && e.target.href != null && e.target.href.substring(0, 4) == 'http' && (window.location = e.target.href);
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

    // ************** 搜索  ******************
    var INDEX_DATA = {};
    var usePushState = (typeof history.pushState !== 'undefined');
    var $body = $('body');
    var MAX_DESCRIPTION_SIZE = 500;

    bindSearch();
    // 初始化搜索索引
    $.getJSON('/Cn/search_index.json').then(function (data) {
        INDEX_DATA = data;
        showResult();
    });

    function bindSearch() {

        function handleUpdate() {
            var $searchInput = $('#book-search-input input');
            var keyword = $searchInput.val();

            if (keyword.length == 0) {
                closeSearch();
            } else {
                launchSearch(keyword);
            }
        }

        $body.on('keyup', '#book-search-input input', function(e) {
            if (e.keyCode === 13) {
                if (usePushState) {
                    var uri = updateQueryString('q', $(this).val());
                    history.pushState({
                        path: uri
                    }, null, uri);
                }

            }
            handleUpdate();
        });

        $body.on('blur', '#book-search-input input', function(e) {
            // Update history state
            if (usePushState) {
                var uri = updateQueryString('q', $(this).val());
                history.pushState({
                    path: uri
                }, null, uri);
            }
        });
    }

    // 执行搜索
    function launchSearch(keyword)
    {
        $body.addClass('with-search');
        $body.addClass('search-loading');

        function doSearch() {
            query(keyword);
            $body.removeClass('search-loading');
        }

        throttle(doSearch)();
    }

    // 关闭搜索
    function closeSearch()
    {
        $('body').removeClass('with-search');
        $('#book-search-results').removeClass('open');
    }

    // 更新url
    function updateQueryString(key, value) {
        value = encodeURIComponent(value);

        var url = window.location.href.replace(/([?&])(?:q|h)=([^&]+)(&|$)/, function(all, pre, value, end) {
            if (end === '&') {
                return pre;
            }
            return '';
        });
        var re = new RegExp('([?&])' + key + '=.*?(&|#|$)(.*)', 'gi'),
            hash;

        if (re.test(url)) {
            if (typeof value !== 'undefined' && value !== null)
                return url.replace(re, '$1' + key + '=' + value + '$2$3');
            else {
                hash = url.split('#');
                url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            }
        } else {
            if (typeof value !== 'undefined' && value !== null) {
                var separator = url.indexOf('?') !== -1 ? '&' : '?';
                hash = url.split('#');
                url = hash[0] + separator + key + '=' + value;
                if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                    url += '#' + hash[1];
                return url;
            } else
                return url;
        }
    }

    // 拿url参数
    function getParameterByName(name) {
        var url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)', 'i'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function showResult() {
        var keyword, type;
        if (/\b(q|h)=([^&]+)/.test(location.search)) {
            type = RegExp.$1;
            keyword = decodeURIComponent(RegExp.$2);
            if (type === 'q') {
                launchSearch(keyword);
            } else {
                highLightPageInner(keyword);
            }
            $('#book-search-input input').val(keyword);
        }
    }

    // 高亮文本
    var highLightPageInner = function(keyword) {
        console.log(keyword);
        $('.page-inner').removeMark();
        $('.page-inner').mark(keyword, {
            'ignoreJoiners': true,
            'acrossElements': true,
            'separateWordSearch': false,
            'className': 'mark_keyword',
        });

        setTimeout(function() {
            var mark = $('[data-jquery-mark="true"]');
            if (mark.length) {
                mark[0].scrollIntoView();
            }
        }, 100);
    };

    function query(keyword) {
        if (keyword == null || keyword.trim() === '') return;

        var results = [],
            index = -1;
        for (var page in INDEX_DATA) {
            if ((index = INDEX_DATA[page].body.toLowerCase().indexOf(keyword.toLowerCase())) !== -1) {
                results.push({
                    url: INDEX_DATA[page].url,
                    title: INDEX_DATA[page].title,
                    body: INDEX_DATA[page].body.substr(Math.max(0, index - 50), MAX_DESCRIPTION_SIZE).replace(new RegExp('(' + escapeReg(keyword) + ')', 'gi'), '<span class="search-highlight-keyword">$1</span>')
                });
            }
        }
        displayResults({
            count: results.length,
            query: keyword,
            results: results
        });
    }

    // Throttle search
    function throttle(fn, wait) {
        var timeout;

        return function() {
            var ctx = this,
                args = arguments;
            if (!timeout) {
                timeout = setTimeout(function() {
                    timeout = null;
                    fn.apply(ctx, args);
                }, wait);
            }
        };
    }

    function escapeReg(keyword) {
        //escape regexp prevserve word
        return String(keyword).replace(/([\*\.\?\+\$\^\[\]\(\)\{\}\|\/\\])/g, '\\$1');
    }

    function displayResults(res) {
        $bookSearchResults = $('.book-search-results');
        $searchList = $bookSearchResults.find('.search-results-list');
        $searchTitle = $bookSearchResults.find('.search-results-title');
        $searchResultsCount = $searchTitle.find('.search-results-count');
        $searchQuery = $searchTitle.find('.search-query');

        $bookSearchResults.addClass('open');

        var noResults = res.count == 0;
        $bookSearchResults.toggleClass('no-results', noResults);

        // Clear old results
        $searchList.empty();

        // Display title for research
        $searchResultsCount.text(res.count);
        $searchQuery.text(res.query);

        // Create an <li> element for each result
        res.results.forEach(function(item) {
            var $li = $('<li>', {
                'class': 'search-results-item'
            });

            var $title = $('<h3>');

            var $link = $('<a>', {
                'href': item.url + '?h=' + encodeURIComponent(res.query),
                'text': item.title,
                'data-is-search': 1
            });

            if ($link[0].href.split('?')[0] === location.href.split('?')[0]) {
                $link[0].setAttribute('data-need-reload', 1);
            }

            var content = item.body.trim();
            if (content.length > MAX_DESCRIPTION_SIZE) {
                content = content + '...';
            }
            var $content = $('<p>').html(content);

            $link.appendTo($title);
            $title.appendTo($li);
            $content.appendTo($li);
            $li.appendTo($searchList);
        });
        $('.body-inner').scrollTop(0);
    }
</script>

</body>
</html>
