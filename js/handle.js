$(function(){
	var totalNum = 17,
		curid = 1;
	var zWin = $(window),
		$imgDetail = $("#imgDetail"),
	  	$contentList = $('#album-list'),
	  	$largeImg = $('#largeImg'),
	  	template = '';
    var deviceWidth = zWin.width(),
      	deviceHeight = zWin.height();
    // 渲染图片列表
    var render = function () {
    	var padding = 2,
	    	realWid = (deviceWidth - 2*8) / 4;
		for (var i = 1; i <= totalNum; i ++) {//通过canvas调用cpu渲染
			template += '<li class="animated bounceIn" data-id="'+ i +'" style="width: '+ realWid +'px;height: '+ realWid +'px;padding:'+padding+'px;"><canvas id="cvs_'+i+'"></canvas></li>';
			var imgsrc='img/'+ i +'.jpg';
			var imgObj = new Image();
			imgObj.index = i;
			imgObj.src = imgsrc;
			imgObj.onload = function(){
				var cvs = $('#cvs_' + this.index)[0].getContext('2d');
				cvs.width = this.width;
				cvs.height = this.height;
				cvs.drawImage(this,0,0);
			};
		}
		$contentList.html(template);
	};

    // 加载大图
	var loadImg = function (id, callback) {
		var imgObj = new Image();
		var paddingTop = 0,
			paddingLeft = 0;
		var imgsrc = "img/" + id + ".large.jpg";
		imgObj.src = imgsrc;
		imgObj.onload = function () {
			var w = this.width;
				h = this.height;

			var realWid,realHei;//大图真实宽高

            if(h/w > 1.2){
            	// 竖屏宽度
            	paddingLeft = parseInt((deviceWidth - deviceHeight*w/h)/2);
            	realWid = 'auto';
            	realHei = deviceHeight + 'px';
            }else{
            	// 横屏高度
            	paddingTop = parseInt((deviceHeight - deviceWidth*h/w)/2);
            	realWid = deviceWidth + 'px';
            	realHei = 'auto';
            }
            $largeImg
            .attr('src',imgsrc)
            .css({width: realWid,height: realHei})
            .css({paddingTop: paddingTop + 'px',paddingLeft: paddingLeft + 'px'});
            // 回调函数
            callback&&callback();
		}
	}

	render();
	// 为图片列表添加事件代理
    $contentList.delegate('li','tap',function(){
    	var id = curid = $(this).attr('data-id');
    	loadImg(id,function(){
    		// 显示大图
			$imgDetail.css({
				width: deviceWidth,
				height: deviceHeight
			}).show();
    	});
    });
    
    // 点击大图时退出
    $imgDetail.tap(function(){
    	$imgDetail.hide();
    });

    // 阻止鼠标点击事件
    $imgDetail.mousedown(function(e){
    	e.preventDefault();
    });

    // 左滑右滑事件
    $imgDetail.swipeLeft(function(){
    	if(curid < totalNum){
    		curid ++;
    	}else{
    		curid = totalNum;
    	}
    	loadImg(curid,function(){
    		$largeImg[0].addEventListener('webkitAnimationEnd',function(){
    			$largeImg.removeClass('animated bounceInRight');
    			$largeImg[0].removeEventListener('webkitAnimationEnd',undefined);
    		},false);
    		$largeImg.addClass('animated bounceInRight');
    	})
    })

    $imgDetail.swipeRight(function(){
    	if(curid > 1){
    		curid --;
    	}else{
    		curid = 1;
    	}
    	loadImg(curid,function(){
    		$largeImg[0].addEventListener('webkitAnimationEnd',function(){
    			$largeImg.removeClass('animated bounceInLeft');
    			$largeImg[0].removeEventListener('webkitAnimationEnd',undefined);
    		},false);
    		$largeImg.addClass('animated bounceInLeft');
    	})
    })
});