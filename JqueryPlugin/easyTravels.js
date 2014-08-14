(function($){
	var Traveler = function(element, options){
		this.$element 		= $(element)
		this.options 		= options
		this.windowSize 	= this.getWindowSize()

		this.$element
			.addClass('section')
			.setClassForDirection()
			.on("click.nav", 'nav > a[href]' , $.proxy(this.backAndForeByClick, this.$element))
			.on('touchstart touchend touchmove', $.proxy(this.backAndForeByTouch, this.$element))
			//.on('orientationchange', $.proxy(this.adaptWindow, this.$element))
			.eq(0).addClass("show")
	}

	Traveler.DEFAULT = {
		duration:500
	}

	Traveler.prototype.backAndForeByClick = function(e){
		e.preventDefault();
		var $ele = this,
		 	dir = $(e.target).data("dir") === "left" ? "leftToRightTrans": "rightToLeftTrans";
		
		$(e.target.getAttribute("href")).addClass(dir).animate({
			left:0
		},{
			duration: 500,
			complete:function(){
				$ele.removeClass('show');
				$(this).removeClass(dir).css("left","none").addClass("show");
			}
		})			
	}

	Traveler.prototype.backAndForeByTouch = function(event){
		var $that = $(event.target);

		switch(event.type){
			case "touchstart":
           	        arguments.callee.lastX = event.originalEvent.targetTouches[0].clientX;
                break;
            case "touchend":
                	var currentX = event.originalEvent.changedTouches[0].clientX,
	                	lastX =  arguments.callee.lastX,
	                	result = currentX - lastX,
	                	leftStr = '0';

	                if (result > 0) leftStr = '100%';
	                else if(result < 0) leftStr = '-100%';
	                	
	            	
	                if (arguments.callee.direction && result) {
	                	$that.animate({
	                		left:leftStr
	                	},{
	                		complete:function(){
	                			$that.removeClass('touchTrans');
	                		}
	                	})
	                }
                break;
            case "touchmove":
	                event.preventDefault();  //prevent scrolling
	                var offset /* 偏移量 */ = event.originalEvent.targetTouches[0].clientX - arguments.callee.lastX,
	                	dir /* 移动方向 */= null

	                if (offset < 0) dir = 'right';
	                else if(offset > 0) dir = 'left';

	                if (offset) {
	                	var sectId = $that.find('a[data-dir="'+dir+'"]').attr('href')
	                	if (sectId) {
	                		$that.removeClass('show').addClass('touchTrans')
	                    	$('section'+sectId).addClass('show')
	                    	$that.css('left', offset)
	                	}	
	                }
	                arguments.callee.direction = sectId;
                break;
		}
	}

	$.fn.setSizeOfSection = function(size){
		return $(this).css({
						width: size.pageWidth + "px",
						height: size.pageHeight + "px"
					})
	}

	$.fn.setClassForDirection = function(){
		return $(this).each(function(){
			var links = $(this).find('nav > a[data-dir]');
			links.each(function(){
				var $that = $(this)
				$that.addClass($that.data('dir') === "left" ? 'laction' : 'raction')
			})
		})
	}

	$.fn.easyTravels = function(option){
		var options = $.extend({}, Traveler.DEFAULT, typeof option == 'object' && option)
			
		new Traveler(this, options)
	}

	$.fn.easyTravels.Constructor = Traveler

	$(document).ready(function(){
		$("section[id]").easyTravels()
	})
})(jQuery)