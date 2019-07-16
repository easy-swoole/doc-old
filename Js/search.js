// ************** 搜索  ******************
$(function () {
    var INDEX_DATA = {};
    var usePushState = (typeof history.pushState !== 'undefined');
    var body = $('body');
    var MAX_DESCRIPTION_SIZE = 500;

    $.getJSON('/Cn/search_index.json').then(function (data) {
        INDEX_DATA = data;
        showResult();
    });

    bindSearch();

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

        body.on('keyup', '#book-search-input input', function (e) {
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

        body.on('blur', '#book-search-input input', function (e) {
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
    function launchSearch(keyword) {
        body.addClass('with-search');
        body.addClass('search-loading');
        $('.right-menu').css('display', 'none');
        function doSearch() {
            query(keyword);
            body.removeClass('search-loading');
        }

        throttle(doSearch)();
    }

    // 关闭搜索
    function closeSearch() {
        $('body').removeClass('with-search');
        $('.right-menu').css('display', 'block');
        $('.book-search-results').removeClass('open');
    }

    // 更新url
    function updateQueryString(key, value) {
        value = encodeURIComponent(value);

        var url = window.location.href.replace(/([?&])(?:q|h)=([^&]+)(&|$)/, function (all, pre, value, end) {
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
    var highLightPageInner = function (keyword) {
        $('.page-inner').removeMark();
        $('.page-inner').mark(keyword, {
            'ignoreJoiners': true,
            'acrossElements': true,
            'separateWordSearch': false,
            'className': 'mark_keyword',
        });

        setTimeout(function () {
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

        return function () {
            var ctx = this,
                args = arguments;
            if (!timeout) {
                timeout = setTimeout(function () {
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
        res.results.forEach(function (item) {
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


});