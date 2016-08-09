import { EasePack, CSSPlugin, TweenLite, TimelineLite } from 'gsap';

var bannerBoy = document.querySelector('#banner-boy');
var boyRun = document.querySelectorAll('.forest__item');
var table = document.querySelector('.forest__table');
var fullscreen = document.querySelector('.fullscreen');
var repeat = document.querySelector('.repeat');
var bannerText1 = document.querySelector('#banner-text-1');
var bannerText2 = document.querySelector('#banner-text-2');
var repeat = document.querySelector('#repeat');
var bannerStart = document.querySelector('.banner__start');
var bannerFinal = document.querySelector('.banner__final');


var timeLine = new TimelineLite({paused:true});

var parentFrameNode;
var parentDoc;
var paddingDiv;
var wave;

var waveAnimationEnabled = false;

var defaultHeight = '200px';
var maxHeight = '560px';

var bigZIndex = '10000000000';


function run(callback){

	var run = function(i){
		if (i <= boyRun.length){
			boyRun[i-1] && boyRun[i-1].classList.remove('forest__item--visible');
			boyRun[i] && boyRun[i].classList.add('forest__item--visible');

			if (i === 6){
				table.classList.add('forest__table--visible');
			}

			if (i === 20){
				fullSize();
			}

			if (i === boyRun.length){
				callback();
				defaultSize();
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
			table.classList.remove('forest__table--visible');
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
			table.classList.remove('forest__table--visible');
			waveAnimationEnabled = false;
		}
	}, '+=1.5');
}

function fullSize(){
	setStyle(parentFrameNode, {
		height: maxHeight,
		zIndex: bigZIndex,
		pointerEvents: 'none',
	});
	setStyle(frameElement, {
		height: maxHeight,		
		pointerEvents: 'none',
	});		
}

function defaultSize(){
	setStyle(parentFrameNode, {
		height: defaultHeight,
		zIndex: '',
		pointerEvents: '',
	});
	setStyle(frameElement, {
		height: defaultHeight,
		pointerEvents: '',
	});			
}

function setStyle(el, styles){
	if (!el || !el.style){
		return;
	}
	for (var key in styles){
		el.style[key] = styles[key];
	}
}

function createWave(){
	var parentDoc = window.parent ? window.parent.document : document;
	var url = 'https://ad.csdnevnik.ru/special/staging/adfox/ostin/forest/970/boy/mahal.png';

	wave = parentDoc.createElement('div');

	console.log(url);

	setStyle(wave, {
		background: 'url(' + url + ') 0 0 no-repeat',
		width: '177px',
			height: '279px',
			position: 'fixed',
			top: '30px',
			right: '-24px',
		'-webkit-transform': 'rotate(-75deg)',
		'-ms-transform': 'rotate(-75deg)',
		'-o-transform': 'rotate(-75deg)',
		transform: 'rotate(-75deg)',
	});

	

	parentDoc.body.appendChild(wave);
}

function iframePosition(){

	//of in iframe
	if (!window.parent || !frameElement){
		return;
	}

	parentDoc = window.parent.document;
	parentFrameNode = frameElement.parentNode;

	paddingDiv = parentDoc.createElement('div');
	paddingDiv.style.height = defaultHeight;

	setStyle(parentFrameNode, {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		width: '100%',
		height: defaultHeight,
		oveflow: 'hidden',
	});

	setStyle(frameElement, {
		width: '100%',		
		height: defaultHeight,
	});

	parentFrameNode.parentNode.insertBefore(paddingDiv, parentFrameNode.parentNode.firstChild);
}

function init(){
	console.log('start');
	iframePosition();

	createWave();

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

