var PageTransitions = (function() {

	var $container = $('#mb-container'),
		$pages = $container.children( 'article.mb-page' ),
		$btnrandomcor = $('#mb-icon-rdm'),
		$home = $('#mb-home'),
		$foo = $('#mb-foo, #mb-contact, #mb-icon-rdm'),
		$btnClass = '',
		pagesCount = $pages.length,
		current = 0,
		currentMenu = 0,
		isAnimating = false,
		endCurrPage = false,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		support = Modernizr.cssanimations;
	
	function init() {
		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		});
		$btnClass = $btnrandomcor.attr('class');
		$pages.eq( current ).addClass( 'mb-page-current' );
		$btnrandomcor.addClass('mb-cor-white');
		$home.on('click', function() {
			if(current==0){
				return false;
			}
			if( isAnimating ) {
				return false;
			}
			nextPage(2,1);
		});
		$foo.on('click', function() {
			if( isAnimating ) {
				return false;
			}
			nextPage(1,777);
		});
	}
	
	$(document).bind('mousewheel DOMMouseScroll', function(event) {
		event.preventDefault();
   		var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
	   	if (delta<0) {
			nextPage(1,delta);
		}else{
			nextPage(2,delta);
		};
	});

	function nextPage(options,delta) {
		var animation = (options.animation) ? options.animation : options;
		if( isAnimating ) {
			return false;
		}
		isAnimating = true;
		var $currPage = $pages.eq(current);
		if (delta==1) {
			current = 0;
		}else{
			if(delta<0){
				++current;
			}else{
				if (delta == 777) {
					current = $pages.length - 1;
				} else{
					--current;
				};
			}
		};
		if (current<0 || current>($pages.length -1)) {
			current = (current<0)?0:$pages.length -1;
			isAnimating = false;
			return false;
		};
		var $nextPage = $pages.eq( current ).addClass( 'mb-page-current' ),
			outClass = '', inClass = '';
			btnClass();
			switch( animation ) {
				case 1:
					outClass = 'mb-page-moveToTop';
					inClass = 'mb-page-moveFromBottom';
					break;
				case 2:
					outClass = 'mb-page-moveToBottom';
					inClass = 'mb-page-moveFromTop';
					break;
			}
		$btnrandomcor.attr('class','');
		$btnrandomcor.attr('class',$btnClass+' '+btnClass);

		$currPage.addClass( outClass ).on( animEndEventName, function() {
			$currPage.off( animEndEventName );
			endCurrPage = true;
			if( endNextPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		$nextPage.addClass( inClass ).on( animEndEventName, function() {
			$nextPage.off( animEndEventName );
			endNextPage = true;
			if( endCurrPage ) {
				onEndAnimation( $currPage, $nextPage );
			}
		} );

		if( !support ) {
			onEndAnimation( $currPage, $nextPage );
		}
		function btnClass () {
			if (current > 0 && current < ($pages.length -1)) {
				btnClass = 'mb-cor-orange';
			}else{
				btnClass = 'mb-cor-white';
			};
		}
	}

	function onEndAnimation( $outpage, $inpage ) {
		endCurrPage = false;
		endNextPage = false;
		resetPage( $outpage, $inpage );
		isAnimating = false;
	}

	function resetPage( $outpage, $inpage ) {
		$outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
		$inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' mb-page-current' );
	}

	init();

	return { 
		init : init,
		nextPage : nextPage,
	};

})();