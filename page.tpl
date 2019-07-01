<!DOCTYPE html>
<html lang="en">
<head>
    <link href="/Css/page.css" rel="stylesheet">
    {$HEAD}
    <style>

        .fa {
            display: inline-block;
            font: normal normal normal 14px/1 FontAwesome;
            font-size: inherit;
            text-rendering: auto;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .exc-trigger:before {
            content: "\f105";
            position: absolute;
            top: 20px;
            left: 15px;
            float: left;
        }

        .exc-trigger2:before {
            content: "\f107";
            position: absolute;
            top: 20px;
            left: 15px;
            float: left;
        }
    </style>
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
        $(this).find('.fa').removeClass('exc-trigger2');
        $(this).find('.fa').addClass('exc-trigger');
        //匹配url
        var pathname = window.location.pathname;
        $('a[href="' + pathname + '"]').parents('li').find('li').show();

        $('a[href="' + pathname + '"]').parents('li').find('.fa').addClass('exc-trigger2').removeClass('exc-trigger');

        $('.summary li').on('click', function () {
            $('.summary li').hide();
            $('.summary>li').show();
            // console.log($(this).html());
            $(this).find('li').show();
            $(this).find('.fa').addClass('exc-trigger2');
            $(this).find('.fa').removeClass('exc-trigger');
        });
    });
</script>
</html>