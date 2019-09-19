<!DOCTYPE html>
<head>
    <meta charset="utf-8">
    <link href="/Css/page.css" rel="stylesheet">
    <link href="https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <script src="https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js" type="text/javascript"></script>
    <script src="/Js/search.js" type="text/javascript"></script>
    <script type="text/javascript" src="/Js/jquery.mark.min.js"></script>

    {!--HEAD--}
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
            {!--SUMMARY--}
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
                            <section class="normal markdown-section">{!--BODY--}</section>
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
</body>
</html>
