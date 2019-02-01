const appURL = location.href.replace(location.hash,"");
let pbVisited = false;
let portfolio = {}, repositories = {};
$.getJSON(appURL+"assets/portfolio.json", function(data){portfolio=data;});
$.getJSON("https://api.github.com/users/webpajooh/repos?sort=updated&direction=asc", function(data){repositories=data;});

//-> General Functions
function portfolioRender(count = portfolio.length){
    $('.portfoliosBox').hide().html('');
    let lp = portfolio.length - count;
    for (let i = portfolio.length - 1; i >= lp; i--) {
        let pTitle = portfolio[i].title;
        let pThumb = portfolio[i].thumb;
        let pLink = portfolio[i].url;
        let pTags = portfolio[i].tags.split(';');
        let pTagsList = '';
        for (j = 0; j < pTags.length; j++) {
            pTagsList = pTagsList + '<li>' + pTags[j] + '</li>';
        }
        let newPortfolio = '<div class="col-lg-3"><a href="' + pLink + '" rel="nofollow" target="_blank"><div class="portfolioBox"><img class="portfolioThumb" src="./assets/image/data/' + pThumb + '" alt="' + pTitle + '"><ul class="portfolioTags">' + pTagsList + '</ul><h3 class="portfolioTitle"><i class="material-icons">done_all</i> <span>' + pTitle + '</span></h3></div></a></div>';
        $('.portfoliosBox').append(newPortfolio).fadeIn(500);
    }
}

function repositoriesRender(count = repositories.length){
    $('.githubsBox').hide().html('');
    let lr = repositories.length - count;
    for (i = repositories.length - 1; i >= lr; i--) {
        let rName = repositories[i].name;
        let rDesc = repositories[i].description;
        if (!rDesc){rDesc='No description';}
        let rLang = repositories[i].language;
        if (!rLang){rLang='Unknown';}
        let rURL = repositories[i].url;
        let newRepositorie = '<div class="col-lg-4 col-sm-12 col-md-6"><a href="' + rURL + '" rel="nofollow" target="_blank"><div class="githubBox"><div class="gb_inner"><div class="githubTop"><h3 class="githubTitle"><i class="material-icons">archive</i> <span>' + rName + '</span></h3><span class="githubCat">' + rLang + '</span></div><div class="githubDesc">' + rDesc + '</div></div></div></a></div>';
        $('.githubsBox').append(newRepositorie).fadeIn(300);
    }
}

function validateForm(){
    let name = $('#cnName').val();
    let family = $('#cnFamily').val();
    let email = $('#cnMail').val();
    let cat = $('.wpSelectTitle').text();
    let text = $('#cnMessage').val();
    if (name.trim()=='' || family.trim()=='' || email.trim()=='' || cat=='موضوع پیام' || text.trim()==''){
        return false;
    }
    return true;
}

function emptyForm(){
    $('.contactPaper').find('input').val('').blur();
    $('.wpSelectTitle').text('موضوع پیام');
}


$(document).ajaxComplete(function(){
    $('.preloader').hide();
    $('.moreBtn').show();
    portfolioRender(4);
    repositoriesRender(3);
});

$(document).ready(function(){
    let ctHeight = $('#coverText').outerHeight() + 250;
    $('.coverBG').css('min-height', ctHeight + 'px');

    function goTo(div){
        $('html, body').animate({scrollTop: $(div).offset().top}, 1000);
    }
    $('.goto').click(function(){
        let div = $(this).attr('href');
        goTo(div);
        return 0;
    });

    $(window).scroll(function(){
        const servicesBoxTop = $('#services').position().top;
        if($(window).scrollTop() > servicesBoxTop){
            $('#goTop').slideDown(500).delay(10);
        }else{
            $('#goTop').slideUp(500).delay(10);
        }
    });
    $('#goTop').click(function(){
        $('html, body').animate({scrollTop: 0}, 1000);
        document.location.hash = '';
    });

    $('.mobile-nav-button').click(function(){
        $('#coverText').toggleClass('blurBG noselect');
        $('body').toggleClass('noscroll');
        $('.mobileVHeader').fadeToggle();
        $('#mobileMenu').animate({width: 'toggle'});
        if ($('.mnbi').text()=='menu'){
            $('.mnbi').text('close');
        }else{
            $('.mnbi').text('menu');
        }
    });
    $('.menuNavbar').find('li').click(function(){
        $('.mobile-nav-button').click();
    });

    $('.portfolioMore').click(function(){
        portfolioRender();
        $(this).hide();
    });
    $('.githubMore').click(function(){
        repositoriesRender();
        $(this).hide();
    });

    $(window).scroll(function(){
        if (pbVisited == false){
            const pbElement = $('.skillProgress').position().top;
            if($(window).scrollTop() > pbElement) {
                $('.skillProgress').each(function(){
                    const pbPercent = $(this).attr('percent');
                    $(this).animate({width: pbPercent}, 2700);
                });
                pbVisited = true;
            };
        }
    });

    $('.wpInput').val('');
    $('.wpInput').focus(function(){
        $('.contactFormMessage').fadeOut();
        let lblElement = $(this).attr('lblClass');
        $(lblElement).animate({'top': '-20px'}, 270, 'swing').css('color', '#B46969');
    }).blur(function(){
        if ($(this).val().length === 0){
            let lblElement = $(this).attr('lblClass');
            $(lblElement).animate({'top': '4px'}, 50).css('color', '#000')
        }
    });
    $('#cnMessage').focus(function(){
        $('.wpl4').animate({'top': '-1px'}, 270, 'swing').css('color', '#B46969');
    }).blur(function(){
        if ($(this).val().length === 0){
            $('.wpl4').animate({'top': '23px'}, 50).css('color', '#000');
        }
    });
    $('#cnCat').click(function(){
        $('.contactFormMessage').fadeOut();
        $('.wpSelectUl').slideToggle();
        return false;
    });
    $(document).click(function(){
        $('.wpSelectUl').slideUp();
    });
    $('.setMessageCat').click(function(){
       let catTitle = $(this).attr('cat');
       $('.wpSelectTitle').hide().html(catTitle).fadeIn(200);
    });
    $('#cnSend').click(function(){
        if (validateForm()){
            let fullName = $('#cnName').val() + " " + $('#cnFamily').val();
            let email = $('#cnMail').val();
            let cat = $('.wpSelectTitle').text();
            let text = $('#cnMessage').val();
            $('#cnSend').html('<span>در حال ارتباط...</span>');
            $.ajax({method: 'POST', data: {fullname: fullName, email: email, cat: cat, text: text}, url: '//mewan.ir/api/reportbug', success: function(result){
                if (result == 'true'){
                    $('#cnSend').html('<span>ارسال پیام</span>');
                    emptyForm();
                    $('#cnToast').fadeIn().delay(3500).fadeOut();
                }else{
                    $('#cnSend').html('<span>ارسال پیام</span>');
                    $('.contactFormMessage').html('<i class="material-icons">error_outline</i> ارسال پیام با خطا مواجه شد!').fadeIn();
                }
                }, error: function(result){
                    $('#cnSend').html('<span>ارسال پیام</span>');
                    $('.contactFormMessage').html('<i class="material-icons">error_outline</i> ارسال پیام با خطا مواجه شد!').fadeIn();
            }});
        }else{
            $('.contactFormMessage').html('<i class="material-icons">error_outline</i> لطفاً فرم را به درستی تکمیل کرده و مجدداً تلاش کنید!').fadeIn();
        }
    });
});