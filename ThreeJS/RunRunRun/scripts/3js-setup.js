const $html = document.documentElement; // Assigns the HTML document's root element to a variable
console.clear(); // Clears the console
// Declares multiple variables for storing references to objects in the code

var target_player;
var target_invader;
var target;
var total = 200;
var spanRadio = 5; // Declares a variable for max distance in the world
var load = false; // Declares if load is ready


// Creates an array of color values
var colors = [
	["red", "#f93d4d"],
	["orange", "#fb5607"],
	["yellow", "#ffbe0b"],
	["green", "#8ac926"],
	["cyan", "#3da5d9"],
	["blue", "#3a86ff"],
	["purple", "#8338ec"],
	["pink", "#ff006e"],
	["grey", "#8392a6"],
	["black", "#22272f"],
];
// colors = addRandomColors(colors, 5);

// Assigns an initial random main and sub color
var mainColor = colors[Math.floor(Math.random() * (colors.length))][0];
var subColor = colors[Math.floor(Math.random() * (colors.length))][0];


// Add colors to body
createCSSColors(colors);

createColorButtons('mainColor', '#mainColor', colors);
createColorButtons('subColor', '#subColor', colors);

var son;
var audioS = {
	audio: './media/music/stompinFeet/mix.mp3', // audio file path
	loop: false, // loop playback (true or false)
	volume: 1, // volume level (value between 0 and 1)
	autostart: true, // start playing automatically
	startTime: 0, // start time of the playback (in seconds)
	reverse: false,
};



// Set up scene
var sceneParams = {
	color: mainColor,
	fog: mainColor,
	near: 0.1,
	far: 50,
	id: 'scene'
};

var sceneData = createScene(sceneParams);
var scene = sceneData.scene;
var renderer = sceneData.renderer;

// Set up Camera
var cameraParams = {
	type: "perspective",
	target: {
		x: 0,
		y: 0,
		z: 0
	},
	position: {
		x: 0,
		y: 10,
		z: 100
	},
	properties: {
		fov: 75,
		near: 0.1,
		far: 100
	},
	id: sceneParams.id,
}
var camera = createCamera(cameraParams);

// Set up lighting
var lightParams = {
	type: 'point',
	scene: scene,
	color: '#ffffff',
	intensity: 1,
	mapSize: (1024 * 2),
	near: .5,
	far: 100,
	position: {
		x: 20,
		y: 20,
		z: 20
	},
	target: {
		x: 0,
		y: 0,
		z: 0
	},
	guide: false,
	shadow: true
};
// Set up ambient lighting
var ambientLightParams = {
	type: 'ambient',
	scene: scene,
	color: '#ffffff',
	intensity: .5,
	mapSize: (1024 * 2),
	near: .5,
	far: 100,
	position: {
		x: 20,
		y: 20,
		z: 20
	},
	target: {
		x: 0,
		y: 0,
		z: 0
	},
	guide: false,
	shadow: false
};

var light = addLight(lightParams);
var ambientLight = addLight(ambientLightParams);


// Set up physics
var gravity = (9.82 * 3); //-9.82,;
var physicsParams = {
	gravity: {
		x: 0,
		y: -(gravity),
		z: 0
	},
	time: 1 / 30,
};
var world = setPhysics(physicsParams);

// Set up floor
var floorParams = {
	scene: scene,
	size: {
		width: 150,
		height: 150
	},
	position: {
		x: 0,
		y: 0,
		z: 0
	},
	rotation: {
		x: -(Math.PI / 2),
		y: 0,
		z: 0
	},
	scale: {
		x: 1,
		y: 1,
		z: 1
	},
	shadow: false,
	color: subColor,
	receive: true,
	shape: "plane"
};
var floor = createPrimitive(floorParams);

// list cars models
var cars = Object.entries(models.car);

// Add enemy "invader" to the world in random coordinates
var invaderPosition = spanRadio * 2;
var invaderParams = {
	path: cars[random(0, (cars.length) - 1, 0)][1],
	scene: scene,
	physics: {
		mass: 30,
		world: world,
	},
	position: {
		x: random(-(invaderPosition), invaderPosition, 0),
		y: random(invaderPosition, invaderPosition * 5, 0),
		z: random(-(invaderPosition), invaderPosition, 0),
	},
	shadow: true,
};
var invader;
createModel(invaderParams).then(
	result => {
		invader = result;
		target_invader = invader;
	}
);


// Add player to the world
var playerPosition = spanRadio;
var playerParams = {
	path: cars[random(0, (cars.length) - 1, 0)][1],
	scene: scene,
	physics: {
		mass: 30,
		world: world,
	},
	shadow: true,
};
var player;
createModel(playerParams).then(
	result => {
		player = result;
		target_player = player;
		target = target_player;

		colorChange(mainColor, 'mainColor');
		colorChange(subColor, 'subColor');


		showTip();
		setInterval(showTip, 10000);
	}
);


// Add player look at to the world
var playerLookParams = {
	scene: scene,
	size: {
		width: 1,
		height: 1,
		depth: 1,
	},
	physics: {
		mass: 10,
		world: world,
	},
	shape: "box"
};
var playerLook = createPrimitive(playerLookParams);




// Add active models (Objecst affected by phisics)
var activeModels = Object.entries(models.active);
var activeModelsPosition = spanRadio;
var activeModelsTotal = total;
var activeObjects = [];
var activeObjectsParams = [];
for (var i = 0; i < activeModelsTotal; i++) {
	(function (i) {
		var activeParams = {
			scene: scene,
			physics: {
				mass: 1,
				world: world,
			},
			shadow: true,
			path: activeModels[random(0, (activeModels.length) - 1, 0)][1],
			position: {
				x: random(-(activeModelsPosition), activeModelsPosition, 2),
				y: random(1, 2, 2),
				z: random(-(activeModelsPosition), activeModelsPosition, 2),
			},
			rotation: {
				x: random(-360, 360, 2),
				y: random(-360, 360, 2),
				z: random(-360, 360, 2),
			},
		};
		createModel(activeParams).then(result => {
			activeObjects[i] = result;
		});
	})(i);
};

// Trace necesary elements
var params = {
	models,
	activeObjects,
	floor,
	invader,
};
console.log(params);



// Controls for character
var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var prevTime = performance.now();

var updateData = {
	multiply: {
		speed: 250,
		position: 0.005,
		rotation: 10,
	},
	character: {
		velocity: {
			x: 0,
			y: 0,
			z: 0
		},
		position: {
			x: 0,
			y: 0,
			z: 0,
			r: 0
		},
		angle: 0,
	},
	camera: {
		position: {
			x: 5, //0
			y: 10,
			z: 10
		},

		rotation: {
			x: 0,
			y: 0,
			z: 0,
		},
		time: 5,
	},
	light: {
		position: {
			x: 0,
			y: 20,
			z: 0
		},
		time: 30,
	},
	delta: 1 / 60,
	time: 0
};


var renderData = {
	speed: 200,
	position: 0.005,
	rotation: .5,
	delta: 1 / 30,
	velocity: new THREE.Vector3(),
	direction: new THREE.Vector3(),
	camera: {
		position: {
			x: 2.5, //0
			y: 10,
			z: 588
		},
		rotation: {
			x: 0,
			y: 0,
			z: 0,
		},
		time: 2,
	},
	light: {
		position: {
			x: 0,
			y: 20,
			z: 0
		},
		time: 30,
	},
};

var pos = {
	x: 0,
	y: 0,
	z: 0
};
var zoneDistance = spanRadio * 4;
var timeCam;
var CamX;
var CamY;
var CamZ;
// Render loop
function render() {
	if (target) {
		// Request the next animation frame to be called
		requestAnimationFrame(render);

		// Get the current time
		var time = performance.now();
		var delta = (time - prevTime) / 1000;
		renderData = updateControls(renderData, time, prevTime, player);



		updatePosition(invader);
		//updatePosition(playerLook);

		//player.model.lookAt(playerLook.model.position);

		//updatePosition(activeObject);


		// Update the position and rotation of each block based on its body

		if (activeObjects.length) {
			for (var i = 0; i < activeObjects.length; i++) {
				updatePosition(activeObjects[i]);
			}
		}

		// Update the position of the light
		TweenLite.to(light.position, updateData.light.time, {
			x: target_player.body.position.x + updateData.light.position.x,
			y: target_player.body.position.y + updateData.light.position.y,
			z: target_player.body.position.z + updateData.light.position.z,
			ease: Elastic.easeOut
		});
		// Update the position of the camera
		TweenLite.to(camera.position, updateData.camera.time, {
			x: target_player.body.position.x + updateData.camera.position.x,
			y: target_player.body.position.y + updateData.camera.position.y,
			z: target_player.body.position.z + updateData.camera.position.z,
			ease: Elastic.easeOut
		});


		var targetCoordinates = coordinatesBetween(target_player.body.position, target_invader.body.position, true, false);
		$('#direction #arrow').css('transform', 'rotate(' + targetCoordinates.rotation.xz + 'deg)');
		$('#direction #distance').text(round(targetCoordinates.distance, 0) + ' km');
		$('#direction #distance').css('font-size', ((round(targetCoordinates.distance, 0) - zoneDistance) / 5) + 'px');
		$('#direction #distance').css('line-height', ((round(targetCoordinates.distance, 0) - zoneDistance) / 5) + 'px');

		if (targetCoordinates.distance < zoneDistance) {
			target = target_invader.body;
			CamX = (target_invader.body.position.x + target_player.body.position.x) / 2;
			CamY = (target_invader.body.position.y + target_player.body.position.y) / 2;
			CamZ = (target_invader.body.position.z + target_player.body.position.z) / 2;

			timeCam = updateData.camera.time * 1.25;
			$('#direction #arrow').text('adjust');
		} else {
			target = target_player.body;
			timeCam = updateData.camera.time;
			CamX = target_player.body.position.x;
			CamY = target_player.body.position.y;
			CamZ = target_player.body.position.z;

			$('#direction #arrow').text('straight');
		}

		// Update the position of the light
		TweenLite.to(light.position, renderData.light.time, {
			x: target_player.body.position.x + renderData.light.position.x,
			y: target_player.body.position.y + renderData.light.position.y,
			z: target_player.body.position.z + renderData.light.position.z,
			ease: Elastic.easeOut
		});
		// Update the position of the camera
		TweenLite.to(camera.position, renderData.camera.time, {
			x: renderData.camera.position.x + CamX,
			y: renderData.camera.position.y + CamY,
			z: renderData.camera.position.z + CamZ,
			ease: Elastic.easeOut
		});

		// Update the position of the camera
		TweenLite.to(pos, timeCam, {
			x: target.position.x,
			y: target.position.y,
			z: target.position.z,
			ease: Elastic.easeOut
		});

		// Update the position of the floor

		floor.model.position.x = pos.x;
		floor.model.position.z = pos.z;

		// Point the camera towards the model


		camera.lookAt(pos.x, pos.y, pos.z);
		// Render the scene with

		light.target = target;


		// Step the world with the given world time

		world.step(physicsParams.time);
		renderer.render(scene, camera);
		prevTime = time;
	}
}


function moveTarget(target, distance, timer) {
	var time = random(timer / 2, timer);
	var InvaderNewX = random(-distance, distance);
	var InvaderNewZ = random(-distance, distance);
	console.log({
		time,
		InvaderNewX,
		InvaderNewZ,
	});
	var tw = TweenLite.to(target, time, {
		x: InvaderNewX,
		z: InvaderNewZ,
		ease: Linear.easeNone,
		onComplete: function () {
			moveTarget(target, distance, timer);
		}
	});
}