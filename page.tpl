<!DOCTYPE html>
<html lang="en">
<head>
    <link href="/Css/page.css" rel="stylesheet">
    {$HEAD}
</head>
<body>
<div class="book without-animation with-summary">
    <div class="book-summary">
        <nav role="navigation">
            <ul class="summary">
                {$MENU}
            </ul>
        </nav>
    </div>

    <div class="book-body">
        <div class="body-inner">
            <div class="page-wrapper">
                <div class="page-inner">
                    {$PAGE}
                </div>
            </div>
        </div>
    </div>
</div>
</body>
<script>
    $(function () {
        $('.summary li').hide();
        $('.summary>li').show();
        //匹配url
        var pathname = window.location.pathname;
        $('a[href="'+pathname+'"]').parents('li').find('li').show();

        $('.summary li').on('click',function () {
            $('.summary li').hide();
            $('.summary>li').show();
            if ($(this).css('display')=='none'){
                $(this).find('li').show();
            }
        });
    });
</script>
</html>