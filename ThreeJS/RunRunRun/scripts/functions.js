/* Sound*/
const defaultSound = {
	audio: 'sound.mp3', // audio file path
	loop: false, // loop playback (true or false)
	volume: 1, // volume level (value between 0 and 1)
	autostart: true, // start playing automatically
	startTime: 0, // start time of the playback (in seconds)
	playbackRate: 1,
	reverse: false,
};

// Creates a player for an audio file and plays the sound
function playSound(params = defaultSound) {
	// Create a player for the audio file
	var player = new Tone.Player(params.audio);
	if (params.loop) {
		player.loop = params.loop;
	} else {
		player.loop = false;
	}
	if (params.autostart) {
		player.autostart = params.autostart;
	} else {
		player.autostart = true;
	}
	if (params.volume) {
		player.volume.value = params.volume;
	} else {
		player.volume.value = 1;
	}
	if (params.playbackRate) {
		player.playbackRate = params.playbackRate;
	} else {
		player.playbackRate = 1;
	}
	if (params.reverse) {
		player.reverse = params.reverse;
	} else {
		player.reverse = false;
	}

	// Wait until Tone.js has loaded all assets
	Tone.start();
	Tone.loaded().then(() => {

		player.toDestination();
		if (params.startTime) {
			player.start(params.startTime).toDestination();
		}
	});
	return player;
}

// Function to set the pitch of a sound player
function soundPitch(player, val) {
	// Disconnect the current pitch if it exists
	if (player.pitch) {
		player.pitch.disconnect();
	}
	// Create a new PitchShift object with the specified value and connect it to the destination
	player.pitch = new Tone.PitchShift(val).toDestination();
	player.connect(player.pitch);
	// Return the created pitch object
	return player.pitch;
}

function updateSound(player, type, value) {
	// Object that maps string `type` to its respective constructor
	const types = {
		pitch: Tone.PitchShift,
		panning: Tone.Panner, // Value within [-1, 1]
		filter: Tone.Filter, // Value within [0, 3.4]
		delay: Tone.FeedbackDelay,
		distortion: Tone.Distortion,
		reverb: Tone.Reverb,
		compressor: Tone.Compressor,
		autoFilter: Tone.AutoFilter,
		autoPanner: Tone.AutoPanner,
		chorus: Tone.Chorus,
		eq: Tone.EQ,
		feedback: Tone.FeedbackCombFilter, // Value within [0, 1]
		freeverb: Tone.Freeverb, // Value within [0, 1]
		jcreverb: Tone.JCReverb, // Value within [0, 1]
		tremolo: Tone.Tremolo, // Value within [0, 3.4]
		bitCrusher: Tone.BitCrusher, // Value within [1, 16]
		chebyshev: Tone.Chebyshev,
		convolver: Tone.Convolver,
		fuzz: Tone.Fuzz,
		gate: Tone.Gate,
		lfo: Tone.LFO,
		limiter: Tone.Limiter, //Value within [-100, 0]
		phaser: Tone.Phaser,
		stereoWidener: Tone.StereoWidener, // Value within [0, 1]
		transientShaper: Tone.TransientShaper,
		wahWah: Tone.WahWah,
	};
	// If `type` exists in `types` object
	if (types[type]) {
		// If `player[type]` exists, disconnect it
		if (player[type]) {
			player[type].disconnect();
		}

		// Create a new instance of the corresponding constructor and connect it to `player`
		player[type] = new types[type](value).toDestination();
		player.connect(player[type]);
		// Return the newly created instance
		return player[type];
	} else {
		// If the `type` does not exist, log an error and return undefined
		console.error(`Error: Invalid type "${type}"`);
		return;
	}
}
// Simplify console log
function log(vars) {
	console.log(vars);
	return;
}
// Calculates the power of a number (base^exponent)
function power(base, exponent) {
	return Math.pow(base, exponent);
}
// Rounds a number to a specified number of decimal places
function round(num, dec = 2) {
	return Math.round(num * power(10, dec)) / power(10, dec);
}

function random(min = 0, max = 1, dec = 2) {
	return round(Math.floor(Math.random() * (max - min + 1)) + min, dec);
}

// Rounds a number up to a specified number of decimal places
function ceil(num, dec = 2) {
	return Math.ceil(num * power(10, dec)) / power(10, dec);
}

// Rounds a number down to a specified number of decimal places
function floor(num, dec = 2) {
	return Math.floor(num * power(10, dec)) / power(10, dec);
}

// Returns the absolute value of a number
function abs(num) {
	return Math.abs(num);
}
// Returns the square root of a number
function squareRoot(num) {
	return Math.sqrt(num);
}

// Function to add random colors to an array
function addRandomColors(colors, total) {
	// Check if total is a number
	if (typeof total !== "number") {
		throw new Error("The second parameter must be a number");
	}
	// Calculate the total number of colors after addition
	var totalColors = colors.length + total;
	// Loop to add the random colors
	for (var i = colors.length; i < totalColors; i++) {
		// Generate random hex code
		var hex = Math.floor(Math.random() * 16777215).toString(16);
		// Add to the colors array
		colors[i] = [i, hex, "#" + hex];
	}
	// Return the modified colors array
	return colors;
}

// Add colors to CSS styles
function createCSSColors(colors) {
	// Variables to store the CSS styles
	var colorCSS = '';
	var colorsCSS = '';
	// Loop through the colors array
	for (var i = 0; i < colors.length; i++) {
		// Get the color name and value
		var colorName = colors[i][0];
		var color = colors[i][1];
		var colorVar = '--color-' + colorName;
		// Add the color variable to the colorCSS string
		colorCSS += colorVar + ':' + color + ';\n';
		// Add the color classes to the colorsCSS string
		colorsCSS += '.' + colorName + '{color: var(' + colorVar + ') !important;}\n';
		colorsCSS += '.' + colorName + '-bg{background-color: var(' + colorVar + ') !important;}\n';
		colorsCSS += '.' + colorName + '-border{border-color: var(' + colorVar + ') !important;}\n';
	}
	// Add the main and sub colors to the colorCSS string
	colorCSS += '--color-main:var(--color-' + mainColor + ');\n';
	colorCSS += '--color-sub:var(--color-' + subColor + ');\n';
	// Combine the colorCSS and colorsCSS strings into a single CSS code string
	var colorCSSCode = ':root {\n' + colorCSS + '\n}\n' + colorsCSS;
	if ($('#colors-css').length) {
		$('#colors-css').remove();
	}
	// Add the CSS code to the head of the HTML document
	$('head').append('<style id="colors-css">\n' + colorCSSCode + '\n</style>');
	return;
}

// Creates color buttons and adds them to the specified parent element
function createColorButtons(target, parent, colors) {
	// Clears the parent element
	$(parent).html('');
	// Loops through each color
	for (var i = 0; i < colors.length; i++) {
		var colorName = colors[i][0];
		// Appends a new button element to the parent element with the color name and specified target, and adds onClick event listener to trigger the colorChange function
		$(parent).append('<button onClick="colorChange(\'' + colorName + '\', \'' + target + '\');" title="' + colorName + '" class="color ' + colorName + ' ' + colorName + '-bg"></button>');
	}
}

// Returns the hexadecimal representation of a color based on its name
function getColorByName(name) {
	// Loop through colors array
	for (var i = 0; i < colors.length; i++) {
		if (colors[i][0] == name) {
			return colors[i][1];
		}
	}
}

// Update colors when selected
function colorChange(color, target) {
	// remove the class 'selected' from the previously selected color add class 'selected' to the selected color
	$('#' + target + ' .color.selected').removeClass('selected');
	$('#' + target + ' .color.' + color).addClass('selected');
	// update the global variable with the selected color
	window[target] = color;
	// create CSS colors
	createCSSColors(colors);
	// get the hexadecimal representation of the color
	var colorHex = getColorByName(color);
	// if the target is mainColor
	if (target == 'mainColor') {
		scene.background = new THREE.Color(colorHex);
		scene.fog = new THREE.Fog(colorHex, sceneParams.near, sceneParams.far);
	}
	// if the target is subColor
	if (target == 'subColor') {
		var material = floor.model.material;
		material.color.set(new THREE.Color(colorHex));
	}
}

// Get a random tip from the `tips` array
function showTip() {
	const randomTip = tips[Math.floor(Math.random() * tips.length)];
	$('#tips').text(randomTip);
}

/* Keyboard controls */
var movement = {
	forward: false,
	left: false,
	backward: false,
	right: false,
	jump: false,
	rotateLeft: false,
	rotateRight: false,
	up: false,
	down: false,
};
const keys = [{
		key: 'w',
		code: 87,
		movement: 'forward'
	},
	{
		key: 'a',
		code: 65,
		movement: 'left'
	},
	{
		key: 's',
		code: 83,
		movement: 'backward'
	},
	{
		key: 'd',
		code: 68,
		movement: 'right'
	},
	{
		key: 'e',
		code: 69,
		movement: 'jump'
	},
	{
		key: 'up',
		code: 38,
		movement: 'up'
	},
	{
		key: 'down',
		code: 40,
		movement: 'down'
	},
	{
		key: 'left',
		code: 37,
		movement: 'rotateLeft'
	},
	{
		key: 'right',
		code: 39,
		movement: 'rotateRight'
	},
	{
		key: 'space',
		code: 32,
		movement: 'jump'
	},
];

// Adds keydown and keyup event listeners to the document
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);

// Function that executes when a key is pressed down
function onKeyDown(event) {
	var code = event.keyCode;
	var key = keys.find(k => k.code === code);
	if (key) {
		movement[key.movement] = true;
	}
}

// Function that executes when a key is released
function onKeyUp(event) {
	var code = event.keyCode;
	var key = keys.find(k => k.code === code);
	if (key) {
		movement[key.movement] = false;
	}
}
