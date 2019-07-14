<!DOCTYPE html>
<html lang="en">
<head>
    <link href="/Css/page.css" rel="stylesheet">
    <link href="https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <script src="https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js" type="text/javascript"></script>
    <script src="/Js/search.js" type="text/javascript"></script>
    <script type="text/javascript" src="/Js/jquery.mark.min.js"></script>
    {$HEAD}
</head>
<body>
<div class="book with-summary without-animation" id="book-main">
    <div class="book-summary">
        <div id="book-search-input" role="search">
            <i class="fa fa-search" id="search_i"></i>
            <input type="text" placeholder="Search">
            <div style="clear: both;"></div>
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
                        <!--右侧本章导航-->
                        <div class="right-menu"></div>
                        <!--右侧本章导航结束-->
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

    // ***右侧本章节导航**
    var rightMenu = [];
    $(".markdown-section").children().each(function(index, element) {
        var tagName=$(this).get(0).tagName;
        if(tagName.substr(0,1).toUpperCase()=="H"){
            var contentH=$(this).html();//获取内容
            var markid="mark-"+tagName+"-"+index.toString();
            $(this).attr("id",markid);//为当前h标签设置id
            var level = tagName.substr(1,2);
            rightMenu.push({
                level: level,
                content: contentH,
                markid: markid,
            });
        }
    });
    $('.right-menu').append("<div class='title'><i class='fa fa-list'></i> 本章导航</div>");
    $.each(rightMenu, function (index, item) {
        var padding_left = (item.level - 1) * 12 +"px";
        $('.right-menu').append("<li style='padding-left:"+padding_left+"'><a href='#"+item.markid+"' class='right-menu-item'>"+item.content+"</a></li>");
    });
    //初始化
    funScroll();
    $('.book-body').scroll(funScroll);//只放这条 审查元素时候滚动有效 普通打开无效
    $('.body-inner').scroll(funScroll);// 加了这条 普通打开滚动有效 只留这条 审查元素滚动无效 怀疑是在不同环境 滚动事件依附的dom优先级不同
    //条滚动事件方法
    function funScroll() {
        //获取当前滚动条的高度
        var top = $(document).scrollTop();
        var dom = $("h1,h2,h3,h4,h5");
        var menuDom = $(".right-menu-item");
        //遍历所有的div
        dom.each(function(index) {
            var $divObj = $(this);
            var thisTop = $divObj.offset().top;
            if (top+10 >= thisTop) {
                //获取当前高亮的选项
                var $activeObj = menuDom.find(".active");
                if (menuDom[index] && $(menuDom[index]) !== $activeObj) {
                    $(".right-menu-item.active").removeClass("active");
                    $(menuDom[index]).addClass("active");
                }
            }
        });
    }
</script>

</body>
</html>
