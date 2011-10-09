/*
	From scriptaculous' treasure chest
	Some with slight mods to make work correctly.
*/

Effect.Transitions.slowstop = function(pos) {
	return 1-Math.pow(0.5,20*pos);
}


Effect.Transitions.exponential = function(pos) {
	return 1-Math.pow(1-pos,2);
}

Effect.Unfold = function(element) {
	element = $(element);
	var elementDimensions = element.getDimensions();
	var oldStyle = {
		top: element.style.top,
		left: element.style.left,
		width: element.style.width,
		height: element.style.height };
	element.makeClipping();
	return new Effect.Scale(element, 100, Object.extend({   
		scaleContent: false,
		scaleY: false,
		scaleFrom: 1,
		scaleMode: {originalHeight: elementDimensions.height, originalWidth: elementDimensions.width},
		afterSetup: function(effect) {
			effect.element.makeClipping();
			effect.element.setStyle({width: '1px', height: '5%'}).show();
/*			effect.element.makeClipping().setStyle({width: '1px', height: '1px'}).show(); */
		},
		afterFinishInternal: function(effect) {
			new Effect.Scale(element, 100, {
				scaleContent: false, 
				scaleX: false,
				scaleFrom: 5,
				scaleMode: {originalHeight: elementDimensions.height, originalWidth: elementDimensions.width},
				restoreAfterFinish: true,
				afterSetup: function(effect) {
					effect.element.makeClipping();
					effect.element.setStyle({height: '1px'}).show(); 
/*					effect.element.makeClipping().setStyle({height: '1px'}).show(); */
				},  
				afterFinishInternal: function(effect) {
					effect.element.undoClipping().setStyle(oldStyle);
				}
			});
		}
	}, arguments[1] || {}));
};


Effect.Bounce = Class.create();
Object.extend(Object.extend(Effect.Bounce.prototype, Effect.Base.prototype), {
	initialize: function(element) {
		this.element = $(element);
		var options = Object.extend({
			x:0, y:200,
			acceleration: 9.81,
			transition: Effect.Transitions.linear,
			mode: 'relative'
		}, arguments[1] || {});
		this.start(options);
	},
	setup: function() {
		Element.makePositioned(this.element);
		this.originalLeft = parseFloat(Element.getStyle(this.element,'left') || '0');
		this.originalTop  = parseFloat(Element.getStyle(this.element,'top')  || '0');
		if(this.options.mode == 'absolute') {
			this.options.x = this.options.x - this.originalLeft;
		}
	},
	mytransition: function(pos){
		var temp = (pos < 0.5 ? 0.5-pos : 0.5+(1-pos)); 
		return (pos < 0.5 ? this.options.acceleration/2*temp*temp : this.options.acceleration/2*(1-temp)*(1-temp) ) *8 /this.options.acceleration - 1;
	},
	update: function(position) {
		Element.setStyle(this.element, {
			left: this.options.x  * position + this.originalLeft + 'px',
			top:  this.originalTop + this.options.y * this.mytransition(position)   + 'px'
		});
	}
});


Effect.Center = function(element) {
	try {
		element = $(element);
	} catch(e) {
		return;
	}

	var my_width  = 0;
	var my_height = 0;

	if ( typeof( window.innerWidth ) == 'number' ) { 
		my_width  = window.innerWidth;
		my_height = window.innerHeight;
	} else if ( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) { 
		my_width  = document.documentElement.clientWidth;
		my_height = document.documentElement.clientHeight;
	} else if ( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) { 
		my_width  = document.body.clientWidth;
		my_height = document.body.clientHeight;
	}

	element.style.position = 'absolute';
	element.style.display  = 'block';
	element.style.zIndex   = 99;

	var scrollY = 0;

	if ( document.documentElement && document.documentElement.scrollTop ) {
		scrollY = document.documentElement.scrollTop;
	} else if ( document.body && document.body.scrollTop ) {
		scrollY = document.body.scrollTop;
	} else if ( window.pageYOffset ) {
		scrollY = window.pageYOffset;
	} else if ( window.scrollY ) {
		scrollY = window.scrollY;
	}

	var elementDimensions = Element.getDimensions(element);

	var setX = ( my_width  - elementDimensions.width  ) / 2;
	var setY = ( my_height - elementDimensions.height ) / 2 + scrollY;

	setX = ( setX < 0 ) ? 0 : setX;
	setY = ( setY < 0 ) ? 0 : setY;

	element.style.left = setX + "px";
	element.style.top  = setY + "px";
}

Effect.DropIn = function(element) {
	element = $(element);
	var oldTop = element.style.top;
	var oldLeft = element.style.left;
	var pos = Position.cumulativeOffset(element);
	return new Effect.Parallel( [ 
			new Effect.MoveBy(element, 100, 0, { sync: true }), 
			new Effect.Opacity(element, { sync: true, from:0.0, to: 1.0 }) 
		],
		Object.extend( { 
			duration: 0.5,
			beforeSetup: function(effect) { 
				Element.makePositioned(effect.effects[0].element); 
				Element.setOpacity(element, 0);
				element.style.position = 'absolute'; 
				element.style.top = (pos[1]-100) + 'px'; 
			}
		}, arguments[1] || {})
	);
}

Effect.ShakeVertical = function(element) {
	element = $(element);
	var oldStyle = {
		top: Element.getStyle(element, 'top'),
		left: Element.getStyle(element, 'left') };
	return new Effect.Move(element, 
		{ x:  0, y: 20, duration: 0.05, afterFinishInternal: function(effect) {
		new Effect.Move(effect.element,
		{ x: 0, y: -40, duration: 0.1,  afterFinishInternal: function(effect) {
		new Effect.Move(effect.element,
		{ x:  0, y: 40, duration: 0.1,  afterFinishInternal: function(effect) {
		new Effect.Move(effect.element,
		{ x: 0, y: -40, duration: 0.1,  afterFinishInternal: function(effect) {
		new Effect.Move(effect.element,
		{ x:  0, y: 40, duration: 0.1,  afterFinishInternal: function(effect) {
		new Effect.Move(effect.element,
		{ x: 0, y: -20, duration: 0.05, afterFinishInternal: function(effect) { with(Element) {
		undoPositioned(effect.element);
		setStyle(effect.element, oldStyle);
	}}}) }}) }}) }}) }}) }});
}




