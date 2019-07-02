<!DOCTYPE html>
<html lang="en">
<head>
    <link href="/Css/page.css" rel="stylesheet">
    <link href="http://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <script src="/Js/jquery-2.0.3.min.js" type="text/javascript"></script>
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
        //先隐藏除了一级元素的所有元素
        $('.summary li').not('.summary>li').hide();
        //删除所有的exc-trigger2元素
        $(this).find('.fa').removeClass('exc-trigger2');
        $(this).find('.fa').addClass('exc-trigger');
        //匹配url
        var pathname = window.location.pathname;
        $('a[href="' + pathname + '"]').parents('li').find('li').show();
        $('a[href="' + pathname + '"]').parents('li').find('.fa').addClass('exc-trigger2');
        $('a[href="' + pathname + '"]').parents('li').find('.fa').removeClass('exc-trigger');
        $('a[href="' + pathname + '"]').parents('li:first').addClass('active');

        $('.summary li').on('click', function () {
            // console.log(1);
            // console.log($(this).find('.fa').hasClass('exc-trigger2'));
            if ($(this).find('a:first').attr('href')&&!$(this).find('.fa').hasClass('exc-trigger2')) {
                if ($(this).find('a:first').attr('target')=='_blank'){
                    window.open($(this).find('a:first').attr('href'));
                }else{
                    window.location.href = $(this).find('a:first').attr('href');
                }
                return false;
            }

            if ($(this).find('.fa').hasClass('exc-trigger2')) {
                $(this).find('li').slideUp(300);
                $(this).find('.fa').removeClass('exc-trigger2');
                $(this).find('.fa').addClass('exc-trigger');
            } else {
                $(this).children('ul').children('li').slideDown(300);
                $(this).children('span').find('.fa').addClass('exc-trigger2');
                $(this).children('span').find('.fa').removeClass('exc-trigger');
            }
            return false;
        });
    });
</script>
</html>