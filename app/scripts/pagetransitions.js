var PageTransitions = (function() {

	var $container = $('#mb-container'),
		$pages = $container.children( 'article.mb-page' ),
		$btnrandomcor = $('#mb-icon-rdm'),
		$home = $('#mb-home'),
		$foo = $('#mb-foo'),
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
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		// support css animations
		support = Modernizr.cssanimations;
	
	function init() {
		$pages.each( function() {
			var $page = $( this );
			$page.data( 'originalClassList', $page.attr( 'class' ) );
		});
		$btnClass = $btnrandomcor.attr('class');
		$pages.eq( current ).addClass( 'mb-page-current' );
		$btnrandomcor.addClass('mb-cor-orange');
		/*$menuItems.on("click",function() {
			console.log("menu: "+isAnimating);
			if( isAnimating ) {
				return false;
			}
			currentMenu = $(this).index() + 1;

			if (currentMenu==current) {
				return false;
			};
			if (currentMenu<current) {
				nextPage(2);
			}else{
				nextPage(1);
			};
		})*/

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
			nextPage(1);
		});
	}
	
	function nextPage(options,type) {
		var animation = (options.animation) ? options.animation : options;
		if( isAnimating ) {
			return false;
		}
		isAnimating = true;

		var $currPage = $pages.eq(current);

		if (type==1) {
			current = 0;
		}else{
			if(currentMenu==0){
				++current;
			}else{
				current=currentMenu;
			}
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
			console.log('BTN CLASS');
			switch(current){
				case 1:
					btnClass = 'mb-cor-black';
					break;
				default:
					btnClass = 'mb-cor-orange';
			}
			console.log('BTN CLASS: '+btnClass);
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