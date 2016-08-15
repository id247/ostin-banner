import { EasePack, CSSPlugin, TweenLite, TimelineLite } from 'gsap';

var prefix = '_ostin-970';

var styles 		= document.querySelector('#' + prefix + '-styles');
var table 		= document.querySelector('.' + prefix + '-forest__table');
var fullscreen 	= document.querySelector('.' + prefix + '-fullscreen');
var wave 		= document.querySelector('.' + prefix + '-mahal');

var boyRun 		= document.querySelectorAll('.' + prefix + '-forest__item');

var bannerBoy 	= document.querySelector('#banner-boy');
var bannerText1 = document.querySelector('#banner-text-1');
var bannerText2 = document.querySelector('#banner-text-2');
var repeat 		= document.querySelector('#repeat');
var bannerStart = document.querySelector('.banner__start');
var bannerFinal = document.querySelector('.banner__final');

var timeLine = new TimelineLite({paused:true});

var parentWin = window;
var parentDoc = document;

var waveAnimationEnabled = false;

function run(callback){

	var run = function(i){
		if (i <= boyRun.length){
			boyRun[i-1] && boyRun[i-1].classList.remove(prefix + '-forest__item--visible');
			boyRun[i] && boyRun[i].classList.add(prefix + '-forest__item--visible');

			if (i === 6){
				table.classList.add(prefix + '-forest__table--visible');
			}


			if (i === boyRun.length){
				callback();
			}
			
			setTimeout(function(){
				run(++i);
			}, 150);
		}
	}				
	run(0);
}

function waveAnimation(wave, callback){
	
	function animate(i){
		if (!waveAnimationEnabled){
			return;
		}		
		if (i === 8){
			i = 0;
		}
		var position = -177 * i;
		setStyle(wave, {
			backgroundPosition: position + 'px 0',
		});	
		setTimeout(function(){
			animate(++i);	
		}, 200);
		
	}
	animate(0);
};

function createTimeline(){

	timeLine.set(bannerStart, {
		opacity: 1,
		onComplete: function(){
			table.classList.remove(prefix + '-forest__table--visible');
			waveAnimationEnabled = false;
		}
	})
	.fromTo(bannerText1, 1.0,{
		top: '-130px',
		scale: 1,
	},{	
		top: '45px',
		//ease: Power2.easeOut,
	})
	.to(bannerBoy, 1.0, {
		top: '0px',
		//ease: Power2.easeOut,
	}, 0)
	.to(bannerBoy, 1.0, {
		scale: .3,
		top: '50px',
		//ease: Power2.easeOut,
	}, '+=.5')
	.to(bannerText1, 1.0, {
		opacity: 0,
		scale: 0,
		//ease: Bounce.easeOut,
	})
	.fromTo(bannerText2, 1.2, {
		opacity: 0,
		scale: 0,
	},{
		opacity: 1,
		scale: 1,
		//ease: Power2.easeOut,
	}, '-=.4')
	.set(bannerBoy, {
		display: 'none',	
	})
	.set(fullscreen, {
		display: 'block',
		opacity: 1,	
		onComplete: function(){
			timeLine.pause();
			run(function(){
				timeLine.resume();
			});
		}
	})
	.set(bannerBoy, {
		display: 'none'
	})
	.to(fullscreen, .3, {
		opacity: 0,
	})
	.to(bannerText2, .6, {
		opacity: 0,
		scale: 0,
		ease: Back.easeInOut,
	}, 'final')
	.to(repeat, .3, {
		opacity: 1,
		visibility: 'visible',
		//ease: Bounce.easeOut,
	}, 'final')
	.to(bannerStart, .5, {
		opacity: 0,
		//ease: Bounce.easeOut,
	}, 'final')
	.fromTo(bannerFinal, .6, {
		opacity: 0,
		//ease: Bounce.easeOut,
	},{
		opacity: 1,
		onComplete: function(){
			waveAnimationEnabled = true;
			waveAnimation(wave);
		}
		//ease: Bounce.easeOut,
	}, '-=.3')
	.fromTo(wave, .5,{
		right: '-250px'
	},{
		right: '-24px'
	})
	.to(wave, .5,{
		right: '-250px',
		onComplete: function(){
			table.classList.remove(prefix + '-forest__table--visible');
			waveAnimationEnabled = false;
		}
	}, '+=1.5');
}

function setStyle(el, styles){
	if (!el || !el.style){
		return;
	}
	for (var key in styles){
		el.style[key] = styles[key];
	}
}


function bgPosition(){

	if (!rnd){
		return;
	}

	const parentFrame = parentDoc.getElementById('AdFox_banner_' + rnd);

	if (!parentFrame){
		return;
	}

	const paddingTop = document.createElement('div');

	setStyle(parentFrame, {
		top: '0px',
		left: '50%',
		marginLeft: '-960px',
		position: 'absolute',
	});

	setStyle(paddingTop, {
		height: '200px',
	});

	parentDoc.body.insertBefore(paddingTop, parentDoc.body.firstChild);
}

function positions(){

	//if in iframe
	if (!window.parent || !frameElement){
		return;
	}

	parentWin = window.parent;
	parentDoc = window.parent.document;

	bgPosition();

	const top = frameElement.getBoundingClientRect().top;
	const scrollTop = parentWin.scrollY;

	const stylesUrl = styles.getAttribute('href');
	const newStyles = parentDoc.createElement('link');
	
	newStyles.setAttribute('rel', 'stylesheet');
	newStyles.setAttribute('href', stylesUrl);

	newStyles.onload = function(){
		console.log('loaded');
		parentDoc.body.appendChild(fullscreen);
		parentDoc.body.appendChild(wave);
	}

	parentDoc.head.appendChild(newStyles);

	setStyle(fullscreen, {
		top: scrollTop + top + 'px',
	});
}

function init(){
	console.log('start');
	positions();
	createTimeline();

	//timeLine.seek('final');
	timeLine.play();

	repeat.addEventListener('click', function(e){
		e.preventDefault();
		timeLine.restart();
	});
}

window.onload = function(){
	init();
}

