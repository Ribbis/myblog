/* iLost JS Code. */
(function(){
(function(jQuery){ilostQ=jQuery.noConflict();var $window=ilostQ(window),$document=ilostQ(document),mouseover_tid=[],mouseout_tid=[];
$document.ready(function(){
  var $nav=ilostQ('#navs'),$searchs=ilostQ('#searchform #s'),Storage=localStorage,$username=ilostQ('input#author'),$usermaill=ilostQ('input#email'),$userurl=ilostQ('input#url');
  $nav.find('li').has('ul').addClass('sub-ul');
  $nav.find('li').each(function(index){ilostQ(this).hover(function(){var _self=this;clearTimeout(mouseout_tid[index]);mouseover_tid[index]=setTimeout(function(){ilostQ(_self).find('ul:eq(0)').slideDown(200);},200);},function(){var _self=this;clearTimeout(mouseover_tid[index]);mouseout_tid[index]=setTimeout(function(){ilostQ(_self).find('ul:eq(0)').slideUp(200);},200);});});
  $searchs.focus(function(){if(ilostQ(this).val()=='Search blog...'){ilostQ(this).css({color:'#555'}).val('');}
  }).blur(function(){if(ilostQ(this).val()==''){ilostQ(this).css({color:'#aaa'}).val('Search blog...');}});
  ilostQ(function(){if($searchs.val()=='' || $searchs.val()=='Search blog...'){$searchs.css({color:'#999'}).val('Search blog...');}});
  if(Storage.ilostQ_commentform_author){$username.val(Storage.ilostQ_commentform_author);}
  if(Storage.ilostQ_commentform_author){$usermaill.val(Storage.ilostQ_commentform_email);}
  if(Storage.ilostQ_commentform_author){$userurl.val(Storage.ilostQ_commentform_url);}
  $username.blur(function(){Storage.ilostQ_commentform_author=ilostQ(this).val();});
  $usermaill.blur(function(){Storage.ilostQ_commentform_email=ilostQ(this).val();});
  $userurl.blur(function(){Storage.ilostQ_commentform_url=ilostQ(this).val();});
  ilostQ("section .entry a[href*='http://']:not([href*='"+location.hostname+"']),[href*='https://']:not([href*='"+location.hostname+"'])").addClass('external').attr('target','_blank');
  ilostQ('#sidehome li ul').hide();ilostQ('#sidehome li ul:first').show();ilostQ('#sidehome h3:first').addClass('active');ilostQ('#sidehome h3').click(function(){if(ilostQ(this).next().is(':hidden')){ilostQ('#sidehome h3').removeClass('active');ilostQ('#sidehome li ul').slideUp();ilostQ(this).next().slideDown();ilostQ(this).addClass('active');}});
  ilostQ("#share .shareButton").click(function(){ilostQ('#share .popshare').slideDown();setTimeout(sharehide,5000);});
  ilostQ("#share .popshare a").click(function(){ilostQ('#share .popshare').slideUp();});
  ilostQ('body.blog #container article section .title a').click(function(e){
    $url=ilostQ(this).attr('href')+'&ajax=1';
    ilostQ('#container').load($url);
  });
  ilostQ('#comments ul.children li:first-child').addClass('toprep');
  ilostQ('#comments ul.children li:last-child').after('<li class="box-bottom"><span class="left"></span><span class="right"></span></li>');
});$window.load(function(){
  var gotop=ilostQ('#gotop'),share=ilostQ('#share'),side=ilostQ('#aside .clear'),$footer=ilostQ('footer'),$article=ilostQ('article');
  if(share.length>0)var share0ffset=share.offset();
  if(side.length>0)var side0ffset=side.offset();
  var $footer_show=$document.height()-$footer.outerHeight(true)-$window.height();
  $window.scroll(function(){
    gotopbutton(gotop);
	sharefixed(share,share0ffset);
	if($window.width()>600){
	  sidefollow(ilostQ('#aside'),side0ffset,ilostQ('footer'));
	}
  });

});$window.resize(function(){
  //if($window.width()>600){sidefollow(ilostQ('#aside'),side0ffset,ilostQ('footer'));}
});
function sidefollow(id,offset,footer){
  if(id.length>0){
    var footer_show=ilostQ(document).height()-footer.outerHeight(true)-ilostQ(window).height();
    if(id.css('float')=='right')id.css({'left':offset.left+'px'});
	if(id.outerHeight(true)>ilostQ(window).height()){
      if(ilostQ(document).scrollTop()>offset.top+id.outerHeight(true)-ilostQ(window).height()){
        id.css({position:'fixed',bottom:function(index,value){
          if(ilostQ(document).scrollTop()>footer_show){return value=ilostQ(document).scrollTop()-footer_show;
            }else{return value=0;}
		}});
      }else{id.css({position:'static'});}
    }else{
      if(ilostQ(document).scrollTop()>offset.top){
        id.css({position:'fixed',top:function(index,value){if(ilostQ(document).scrollTop()>footer_show){return value=footer_show-ilostQ(document).scrollTop();}else{return value=0;}}
        });
      }else{id.css({position:'static'});}
    }
  }
}
function gotopbutton(id){if(id.length>0){if($document.scrollTop()>=128){id.fadeIn(200);}else{id.fadeOut(200);}}}
function sharefixed(id,offset){if(id.length>0){if(ilostQ('#wpadminbar').length>0){var idtop=offset.top-ilostQ('#wpadminbar').height()-3;}else{var idtop=offset.top;}if($document.scrollTop()>idtop)id.addClass('fixedpop').css({top:function(index,value){if(ilostQ('#wpadminbar').length>0){value=ilostQ('#wpadminbar').height()+3;}else{value=0;}return value;}});if($document.scrollTop()<=idtop){id.removeClass('fixedpop').css({top:'auto'});}}}
})(jQuery);
})();