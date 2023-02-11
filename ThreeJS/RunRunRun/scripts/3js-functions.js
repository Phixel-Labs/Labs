/* Scene*/
const defaultScene = {
	color: 0x000000, // Background color
	fog: 0x333333, // Fog color
	near: 0.1, // Near plane
	far: 100, // Far plane
	id: 'scene' // Id of the container element
};

function createScene(params = defaultScene) {
	// Create a new THREE.Scene object
	var scene = new THREE.Scene();
	// set colors
	scene.background = new THREE.Color(params.color);
	scene.fog = new THREE.Fog(params.fog, params.near, params.far);
	// Creates a new WebGL renderer
	var renderer = new THREE.WebGLRenderer();
	// Get the container element by its id
	var container = document.getElementById(params.id);
	// Set the size of the renderer to the size of the container
	renderer.setSize(container.clientWidth, container.clientHeight);
	// Enable shadows on the scene
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	// Add renderer to container element
	container.appendChild(renderer.domElement);
	// Updates the renderer's size on resize of the container element
	var resizeObserver = new ResizeObserver(entries => {
		entries.forEach(entry => {
			renderer.setSize(entry.contentRect.width, entry.contentRect.height);
		});
	});
	resizeObserver.observe(container);
	// Return the created scene and renderer
	return {
		scene: scene,
		renderer: renderer
	};
}

/* Cameras */
const defaultCamera = {
	type: "perspective", // Type of camera (perspective, orthographic, stereo)
	properties: {
		fov: 75, // Field of view
		near: 0.1, // Near clipping plane
		far: 1000 // Far clipping plane
	},
	position: {
		x: 0, // X position axis
		y: 0, // Y position axis
		z: 0 // Z position axis
	},
	target: {
		x: 0, // X target position axis
		y: 0, // Y target position axis
		z: 0 // Z target position axis
	},
	id: "scene" // ID of container element
};

function createCamera(params = defaultCamera) {
	// Mapping of camera types to their respective constructors
	const types = {
		perspective: THREE.PerspectiveCamera,
		orthographic: THREE.OrthographicCamera,
		stereo: THREE.StereoCamera,
	};
	// Get container element and its width and height
	var container = document.getElementById(params.id);
	var width = container.clientWidth;
	var height = container.clientHeight;
	// Initialize camera variable
	var camera;
	// Check if the camera type exists

	if (!types[params.type]) {
		console.error("Invalid camera type: " + params.type);
		return;
	}
	// Create camera based on its type
	if (params.type === "perspective") {
		camera = new types[params.type](
			params.properties.fov,
			width / height,
			params.properties.near,
			params.properties.far
		);
	} else if (params.type === "orthographic") {
		camera = new types[params.type](
			width / -2,
			width / 2,
			height / 2,
			height / -2,
			params.properties.near,
			params.properties.far
		);
	} else if (params.type === "stereo") {
		camera = new types[params.type]();
		camera.update(params.properties);
	}
	// Set camera position
	camera.position.set(params.position.x, params.position.y, params.position.z);
	// If target defined, make camera look at it
	if (params.target) {
		camera.lookAt(new THREE.Vector3(params.target.x, params.target.y, params.target.z));
	}
	// Updates the camera on resize of the container element
	var resizeObserver = new ResizeObserver(entries => {
		entries.forEach(entry => {
			width = container.clientWidth;
			height = container.clientHeight;
			// Update camera based on its type
			if (params.type === "perspective") {
				camera.aspect = width / height;
			} else if (params.type === "orthographic") {
				camera.left = width / -2;
				camera.right = width / 2;
				camera.top = height / 2;
				camera.bottom = height / -2;
			} else if (params.type === "stereo") {
				camera.aspect = width / height;
			}
			camera.updateProjectionMatrix();
			renderer.setSize(entry.contentRect.width, entry.contentRect.height);
		});
	});
	resizeObserver.observe(container);
	// Return the created camera
	return camera;
}


/* Lighting */
const defaultLight = {
	type: 'point', // Type of light (point, ambient, directional, spot, hemisphere, rectarea)
	scene: "scene", // scene element
	color: 0xffffff, // Color of light in hexadecimal format
	intensity: 1, // Intensity of light
	mapSize: (1024 * 2), // Size of shadow map
	near: .5, // Near clipping plane for shadow rendering
	far: 100, // Far clipping plane for shadow rendering
	position: {
		x: 20, // X position axis
		y: 20, // Y position axis
		z: 20 // Z position axis
	},
	target: {
		x: 0, // X target position axis
		y: 0, // Y target position axis
		z: 0 // Z target position axis
	},
	guide: false, // Flag to display a guide for the light
	shadow: true // Flag to enable/disable shadow rendering
};

function addLight(params = defaultLight) {
	// Mapping of lights types to their respective constructors
	const types = {
		directional: THREE.DirectionalLight,
		point: THREE.PointLight,
		spot: THREE.SpotLight,
		ambient: THREE.AmbientLight,
		hemisphere: THREE.HemisphereLight,
		rectarea: THREE.RectAreaLight,
	};
	// Get the class type for the light type
	const lightClass = types[params.type];
	// Check if the light type is supported
	if (!lightClass) {
		console.error(`Error: Unsupported light type "${params.type}"`);
		return;
	}
	// Create an instance of the light
	let light;
	if (params.type === "hemisphere") {
		light = new lightClass(params.color.sky, params.color.ground, params.intensity);
	} else {
		light = new lightClass(params.color, params.intensity);
	}
	// Set the position and shadow properties for certain light types
	if (!["ambient", "hemisphere", "rectarea"].includes(params.type)) {
		light.position.set(params.position.x, params.position.y, params.position.z);
		light.castShadow = params.shadow;
	}
	// Set the target position for certain light types
	if (["directional", "spot"].includes(params.type)) {
		light.target.position.set(params.target.x, params.target.y, params.target.z);
		if (!light.target) {
			console.error(`Error: Cannot add camera helper for non-targeted light "${params.type}"`);
			return;
		}
	}
	// Add light to scene 
	params.scene.add(light);
	// Optionally add shadow camera properties 
	if (params.shadow) {
		light.shadow.mapSize.width = params.mapSize;
		light.shadow.mapSize.height = params.mapSize;
		light.shadow.camera.near = params.near;
		light.shadow.camera.far = params.far;
	}
	// Optionally add a camera helper for the light
	if (params.guide) {
		params.scene.add(new THREE.CameraHelper(light));
	}
	// Return the created camera
	return light;
}

/* physics */
const defaultPhysics = {
	gravity: { // Default gravity
		x: 0, // x-axis
		y: -9.82, // y-axis (acceleration due to gravity)
		z: 0 // z-axis
	},
	time: 1 / 30, // 30 frames per second
};

function setPhysics(params = defaultPhysics) {
	// Create a new physics world
	var world = new CANNON.World();
	// Set the gravity of the world using the provided parameters
	world.gravity.set(params.gravity.x, params.gravity.y, params.gravity.z);
	var timeStep = params.time;
	// Add a model body to the physics world
	var modelBody = new CANNON.Body({
		mass: 0,
		shape: new CANNON.Plane(),
		position: new CANNON.Vec3(0, 0, 0),
	});
	modelBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
	world.addBody(modelBody);
	// Return the created physics world
	return world;
}


/* Primitive */
var defaultPrimitive = {
	size: {
		width: 10, // Width of the object
		height: 10, // Height of the object
		depth: 10, // Depth of the object
		radius: 10, // Radius of the object
		segments: 10, // Number of segments
		tubeRadius: 1, // Tube radius of the torus
	},
	position: {
		x: 0, // x-axis position of the object
		y: 0, // y-axis position of the object
		z: 0 // z-axis position of the object
	},
	scale: {
		x: 1, // x-axis scale of the object
		y: 1, // y-axis scale of the object
		z: 1 // z-axis scale of the object
	},
	rotation: {
		x: 0, // x-axis rotation of the object, (Math.PI / 2) to make it horizontal
		y: 0, // y-axis rotation of the object
		z: 0 // z-axis rotation of the object
	},
	color: 0xFF0000, // Color of the object
	doubleSided: false, // Specify whether the object should be double sided or not
	opacity: 1, // Opacity of the object
	receive: true, // Specify whether the object should receive shadow or not
	scene: "scene", // Scene element to add the object
	shadow: false, // Specify whether the object should cast shadow or not
	texture: undefined, // Path to the texture to be applied to the object
	transparent: false, // Specify whether the object should be transparent or not
	visible: true, // Specify the visibility of the object
	wireframe: false, // Specify whether the object should be rendered as a wireframe or not
	guide: false, // Specify whether the object should show a box guide
	shape: "box", // Primitive to be created (box, sphere, plane, cylinder, cone, torus)
	physics: {
		mass: 1, // set the object mass
		impulse: {
			x: 0, // x-axis impulse of the object
			y: 0, // y-axis impulse of the object
			z: 0 // z-axis impulse of the object
		},
		force: {
			x: 0, // x-axis force of the object
			y: 0, // y-axis force of the object
			z: 0 // z-axis force of the object
		},
		world: "world", // physic world
		dynamic: true, // Specify whether the object should be dynamic or static
		friction: 0.3, // Set the friction value of the object
		restitution: 0.3, // Set the restitution value of the object
	},
};

function createPrimitive(params = defaultPrimitive) {
	if (!params.shape) {
		console.error(`Error: Cannot create primitive because type is not set`);
		return;
	} else {
		// Mapping of primitives types to their respective 3D varructors
		var types = {
			box: THREE.BoxGeometry,
			sphere: THREE.SphereGeometry,
			plane: THREE.PlaneGeometry,
			cylinder: THREE.CylinderGeometry,
			cone: THREE.ConeGeometry,
			torus: THREE.TorusGeometry,
		};

		// Check if primitive type is supported
		if (!types[params.shape]) {
			console.error(`Error: ${params.shape} is not a supported primitive type`);
			return;
		} else {
			// Set sizes
			var size = {
				width: params.size.width || 10,
				height: params.size.height || 10,
				depth: params.size.depth || 10,
				radius: params.size.radius || 100,
				segments: params.size.segments || 10,
				tubeRadius: params.size.tubeRadius || 1,
			};
			// Create geometry for the object
			var modelGeometry;
			if (params.shape === "plane") {
				modelGeometry = new types[params.shape](size.width, size.height);
			} else if (params.shape === "sphere") {
				modelGeometry = new types[params.shape](size.radius, size.width, size.height);
			} else if (params.shape === "box") {
				modelGeometry = new types[params.shape](size.depth, size.width, size.height);
			} else if (params.shape === "cylinder") {
				modelGeometry = new types[params.shape](size.radius, size.radius, size.height, size.segments);
			} else if (params.shape === "cone") {
				modelGeometry = new types[params.shape](size.radius, size.height, size.segments);
			} else if (params.shape === "torus") {
				modelGeometry = new types[params.shape](size.radius, size.tubeRadius, size.segments, size.segments);
			}
			// Create material for the object
			var materialOptions = {
				color: params.color || 0xFF0000,
				opacity: params.opacity !== undefined ? params.opacity : 1,
				wireframe: params.wireframe || false,
				transparent: params.transparent || false,
			};
			if (params.doubleSided) {
				materialOptions.map = new THREE.TextureLoader().load(params.doubleSided);
			}
			if (params.texture) {
				materialOptions.map = new THREE.TextureLoader().load(params.texture);
			}
			var modelMaterial = new THREE.MeshLambertMaterial(materialOptions);
			// Create the object
			var model = new THREE.Mesh(modelGeometry, modelMaterial);
			// Add visual guide
			if (params.guide) {
				var helper = new THREE.BoxHelper(model, params.color);
				model.add(helper);
			}
			// Set the coordinates of the object
			if (params.position && params.position.x !== undefined && params.position.y !== undefined && params.position.z !== undefined) {
				model.position.set(params.position.x, params.position.y, params.position.z);
			} else {
				model.position.set(0, 0, 0);
			}
			if (params.rotation && params.rotation.x !== undefined && params.rotation.y !== undefined && params.rotation.z !== undefined) {
				model.rotation.set(params.rotation.x, params.rotation.y, params.rotation.z);
			} else {
				model.rotation.set(0, 0, 0);
			}
			if (params.scale && params.scale.x !== undefined && params.scale.y !== undefined && params.scale.z !== undefined) {
				model.scale.set(params.scale.x, params.scale.y, params.scale.z);
			} else {
				model.scale.set(1, 1, 1);
			}
			// Set the shadow
			model.castShadow = params.shadow !== undefined ? params.shadow : true;
			model.receiveShadow = params.receive !== undefined ? params.receive : true;
			// Set the visibility of the object
			model.visible = params.visible !== undefined ? params.visible : true;
			// Add the object to the scene
			params.scene.add(model);
			// Add physics
			if (params.physics) {
				// Mapping of primitives types to their respective physics vectors
				var vectorsPhysic = {
					box: [size.width / 2, size.height / 2, size.depth / 2],
					sphere: [size.radius, size.width, size.height],
					plane: [size.width, 0, size.height],
					cylinder: [size.radius, size.height / 2, 0],
					cone: [size.radius, size.height / 2, 0],
					torus: [size.radius + size.tubeRadius, 0, 0],
				};
				var vector = new CANNON.Vec3(vectorsPhysic[params.shape][0], vectorsPhysic[params.shape][2], vectorsPhysic[params.shape][1]);


				var shapeBody;
				if (params.shape == 'box') {
					shapeBody = new CANNON.Box(vector);
				} else if (params.shape == 'sphere') {
					shapeBody = new CANNON.Sphere(vector);
				} else if (params.shape == 'plane') {
					shapeBody = new CANNON.Plane(vector);
				} else if (params.shape == 'cylinder') {
					shapeBody = new CANNON.Cylinder(vector);
				} else if (params.shape == 'cone') {
					shapeBody = new CANNON.Cone(vector);
				} else if (params.shape == 'torus') {
					shapeBody = new CANNON.Trimesh(vector);
				}



				var body = new CANNON.Body({
					mass: params.physics.mass || 1,
					shape: shapeBody,
					position: new CANNON.Vec3(model.position.x, model.position.y, model.position.z),
					linearVelocity: new CANNON.Vec3(),
					angularVelocity: new CANNON.Vec3(),
					friction: params.physics.friction || 0.3,
					restitution: params.physics.restitution || 0.0,
					type: params.physics.static ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC
				});
				if (params.physics.impulse) {
					body.applyImpulse(
						new CANNON.Vec3(
							params.physics.impulse.x || 0,
							params.physics.impulse.y || 0,
							params.physics.impulse.z || 0
						),
						new CANNON.Vec3()
					);
				}
				if (params.physics.force) {
					body.applyForce(
						new CANNON.Vec3(
							params.physics.force.x || 0,
							params.physics.force.y || 0,
							params.physics.force.z || 0
						),
						new CANNON.Vec3()
					);
				}

				params.physics.world.addBody(body);
			}
		}
		// Return the created plane model
		if (params.physics) {
			return {
				model,
				body
			};
		} else {
			return {
				model
			};
		}
	}
}

var defaultModel = {
	position: {
		x: 0,
		y: 0,
		z: 0
	},
	scale: {
		x: 1,
		y: 1,
		z: 1
	},
	rotation: {
		x: 0,
		y: 0,
		z: 0
	},
	color: 0xFF0000,
	opacity: 1,
	receive: true,
	scene: "scene",
	shadow: false,
	texture: 'undefined',
	path: 'model.glb',
	transparent: false,
	visible: true,
	wireframe: false,
	guide: false,
	physics: {
		mass: 1, // set the object mass
		impulse: {
			x: 0, // x-axis impulse of the object
			y: 0, // y-axis impulse of the object
			z: 0 // z-axis impulse of the object
		},
		force: {
			x: 0, // x-axis force of the object
			y: 0, // y-axis force of the object
			z: 0 // z-axis force of the object
		},
		world: "world", // physic world
		dynamic: true, // Specify whether the object should be dynamic or static
		friction: 0.3, // Set the friction value of the object
		restitution: 0.3, // Set the restitution value of the object
	},
};

function createModel(params = defaultModel) {
	if (!params.path) {
		console.error(`Error: Cannot create model because model path is not set`);
		return;
	} else {
		return new Promise((resolve, reject) => {
			var loader = new THREE.GLTFLoader();
			loader.load(params.path, function (gltf) {
				var model = gltf.scene;

				// Set the coordinates of the object
				if (params.position && params.position.x !== undefined && params.position.y !== undefined && params.position.z !== undefined) {
					model.position.set(params.position.x, params.position.y, params.position.z);
				} else {
					model.position.set(0, 0, 0);
				}
				if (params.rotation && params.rotation.x !== undefined && params.rotation.y !== undefined && params.rotation.z !== undefined) {
					model.rotation.set(params.rotation.x, params.rotation.y, params.rotation.z);
				} else {
					model.rotation.set(0, 0, 0);
				}
				if (params.scale && params.scale.x !== undefined && params.scale.y !== undefined && params.scale.z !== undefined) {
					model.scale.set(params.scale.x, params.scale.y, params.scale.z);
				} else {
					model.scale.set(1, 1, 1);
				}
				// Set the shadow

				gltf.scene.traverse(function (node) {
					if (node.isMesh) {
						if (params.shadow == true !== undefined) {
							node.castShadow = true;
						}
					}
				});

				// Add the object to the scene
				params.scene.add(model);


				// Add visual guide
				if (params.guide) {
					var helper = new THREE.BoxHelper(model, params.color);
					model.add(helper);
				}

				// Add physics
				if (params.physics) {
					var body;
					// Load the .glb model and set it as the shape for the physics body
					var box = new THREE.Box3().setFromObject(model);
					var size = box.getSize(new THREE.Vector3());
					var shape = new CANNON.Box(
						new CANNON.Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5)
					);
					body = new CANNON.Body({
						mass: params.physics.mass || 1,
						shape: shape,
						position: new CANNON.Vec3(model.position.x, model.position.y, model.position.z),
						linearVelocity: new CANNON.Vec3(),
						angularVelocity: new CANNON.Vec3(),
						friction: params.physics.friction || 0.3,
						restitution: params.physics.restitution || 0.0,
						type: params.physics.static ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC
					});

					body.addShape(shape);
					if (params.physics.impulse) {
						body.applyImpulse(
							new CANNON.Vec3(
								params.physics.impulse.x || 0,
								params.physics.impulse.y || 0,
								params.physics.impulse.z || 0
							),
							new CANNON.Vec3()
						);
					}
					if (params.physics.force) {
						body.applyForce(
							new CANNON.Vec3(
								params.physics.force.x || 0,
								params.physics.force.y || 0,
								params.physics.force.z || 0
							),
							new CANNON.Vec3()
						);
					}

					params.physics.world.addBody(body);
				}

				// Return the created plane model
				if (params.physics) {
					resolve({
						model,
						body
					});
				} else {
					resolve({
						model
					});
				}
			});
		});
	}
}




/* Model */
function loadModel(scene, path, scale, position, rotation, mass, shadow, receive, guide) {
	return new Promise((resolve, reject) => {
		var loader = new THREE.GLTFLoader();
		var model;
		var body;
		loader.load(path, function (gltf) {
			model = gltf.scene;
			model.position.set(position.x, position.y, position.z);
			model.rotation.set(rotation.x, rotation.y, rotation.z);
			model.scale.set(scale.w, scale.h, scale.d);

			gltf.scene.traverse(function (node) {
				if (node.isMesh) {
					node.castShadow = shadow;
					if (receive) {
						node.receiveShadow = receive;
					}
				}
			});

			scene.add(model);
			var box = new THREE.Box3().setFromObject(model);
			var size = box.getSize(new THREE.Vector3());
			var shape = new CANNON.Box(
				new CANNON.Vec3(size.x * 0.5, size.y * 0.5, size.z * 0.5)
			);
			body = new CANNON.Body({
				mass: mass,
				shape: shape,
				position: new CANNON.Vec3(model.position.x, model.position.y, model.position.z),
			});
			world.addBody(body);
			if (guide) {
				const helper = new THREE.BoxHelper(model, 0xffff00);
				model.add(helper);
			}

			resolve({
				model,
				body
			});
		});
	});
}
/* Ball */
function createBall(scene, color, size, position, rotation, mass, shadow, receive, guide) {
	var modelGeometry = new THREE.SphereGeometry(size.r, size.w, size.h);
	var modelMaterial = new THREE.MeshLambertMaterial({
		color: color
	});
	var model = new THREE.Mesh(modelGeometry, modelMaterial);
	model.position.set(position.x, position.y, position.z);
	model.rotation.set(rotation.x, rotation.y, rotation.z);
	model.castShadow = shadow;
	model.receiveShadow = receive;
	scene.add(model);
	if (guide) {
		const helper = new THREE.BoxHelper(model, 0xffff00);
		model.add(helper);
	}
	var body = new CANNON.Body({
		mass: mass,
		shape: new CANNON.Sphere(size.r),
		position: new CANNON.Vec3(model.position.x, model.position.y, model.position.z),
	});
	world.addBody(body);
	return {
		model,
		body
	};
}

function updateControls(params, time, prevTime, player) {
	var delta = (time - prevTime) / 1000;


	var position = {
		x: 0,
		y: 0,
		z: 0
	}
	var angle = 0;
	var model = {
		position: player.model.position,
		rotation: player.model.rotation,
	}
	var body = {
		position: player.body.position,
		rotation: player.body.rotation,
	}
	// Calculate the direction in the axis (forward or backward)
	params.direction.x = Number(movement.right) - Number(movement.left);
	params.direction.y = Number(movement.up) - Number(movement.down);
	params.direction.z = Number(movement.forward) - Number(movement.backward);

	if (params.direction.x != 0 || params.direction.y != 0 | params.direction.z != 0) {}

	params.velocity.z -= params.velocity.z * delta;
	params.velocity.x -= params.velocity.x * delta;
	params.velocity.y -= params.velocity.y * delta;

	if (movement.left || movement.right) {
		params.velocity.x += (params.direction.x * params.speed * delta);
	}
	if (movement.up || movement.down) {
		params.velocity.y += (params.direction.y * params.speed * delta);
	}
	if (movement.forward || movement.backward) {
		params.velocity.z -= (params.direction.z * params.speed * delta);
	}

	// Resetting the position along x, y and z axes
	position.x += params.velocity.x * params.position;
	position.y += params.velocity.y * params.position;
	position.z += params.velocity.z * params.position;

	player.body.position.x = player.body.position.x + position.x;
	player.body.position.y = player.body.position.y + position.y;
	player.body.position.z = player.body.position.z + position.z;

	var angleX = (player.body.position.x + position.x) - player.body.position.x;
	var angleZ = (player.body.position.z + position.z) - player.body.position.z;

	var angle = Math.atan2(angleX, angleZ);

	player.model.position.copy(player.body.position);

	var euler = new THREE.Euler(0, angle, 0, 'YXZ');
	var modelQuaternion = new THREE.Quaternion();
	modelQuaternion.setFromEuler(euler);

	player.model.quaternion.copy(player.body.quaternion);
	player.model.quaternion.multiply(modelQuaternion);



	var coord = '';
	coord += '<h3>velocity</h3>';
	coord += 'x: ' + round(params.velocity.x, 0) + '<br>';
	coord += 'y: ' + round(params.velocity.y, 0) + '<br>';
	coord += 'z: ' + round(params.velocity.z, 0) + '<br>';
	coord += '<h3>position</h3>';
	coord += 'x: ' + round(position.x, 0) + '<br>';
	coord += 'y: ' + round(position.y, 0) + '<br>';
	coord += 'z: ' + round(position.z, 0) + '<br>';
	coord += '<h3>body position</h3>';
	coord += 'x: ' + round(player.body.position.x, 0) + '<br>';
	coord += 'y: ' + round(player.body.position.y, 0) + '<br>';
	coord += 'z: ' + round(player.body.position.z, 0) + '<br>';
	coord += '<h3>quaternion</h3>';
	coord += 'x: ' + round(player.model.quaternion.x, 0) + '<br>';
	coord += 'y: ' + round(player.model.quaternion.y, 0) + '<br>';
	coord += 'z: ' + round(player.model.quaternion.z, 0) + '<br>';
	coord += 'w: ' + round(player.model.quaternion.w, 0) + '<br>';
	coord += '<h3>angle</h3>';
	coord += 'x: ' + (angleX) + '<br>';
	coord += 'Z: ' + (angleZ) + '<br>';
	coord += (angle) + '<br>';

	$('#coords').html(coord);

	return params;
}



function add_XYZ_GUI(gui, object, folderName) {
	var folder = gui.addFolder(folderName);
	add_GUI(folder, object, 'x');
	add_GUI(folder, object, 'y');
	add_GUI(folder, object, 'z');
	return folder;
}

function updateModel(world, vars, model, body, movement, gravity, delta, data, velocity, direction, target) {

	// Destructuring the data
	var delta = 1 / 60;
	var speed = data.multiply.speed;
	var multiplyPosition = data.multiply.position;
	var multiplyRotation = data.multiply.rotation;

	var modelAngle = data.character.angle;
	var modelPosition = data.character.position;
	var modelVelocity = data.character.velocity;

	// Calculate the direction in the axis (forward or backward)
	direction.z = Number(movement.forward) - Number(movement.backward);
	direction.x = Number(movement.right) - Number(movement.left);
	direction.normalize();

	// Resetting the velocity along x, y and z axes
	modelVelocity.z -= modelVelocity.z * delta;
	modelVelocity.x -= modelVelocity.x * delta;
	modelVelocity.y -= modelVelocity.y * delta;

	// Check if the keys flag are set
	/*
	if (movement.jump) {
		modelVelocity.y += gravity;
	}
	*/
	if (movement.forward || movement.backward) {
		modelVelocity.z -= direction.z * speed * delta;
	}
	if (movement.left || movement.right) {
		modelVelocity.x += direction.x * speed * delta;
	}
	// Rounding the velocity values along x, y and z axes
	modelVelocity.x = round(modelVelocity.x);
	modelVelocity.y = round(modelVelocity.y);
	modelVelocity.z = round(modelVelocity.z);

	if (modelVelocity.y <= 0) {
		modelVelocity.y = 0;
	}



	// Animating the velocity
	TweenLite.to(velocity, 10, {
		x: modelVelocity.x,
		z: modelVelocity.z,
		ease: Elastic.easeOut
	});
	velocity.y = modelVelocity.y;

	var speed = abs(round((modelVelocity.x + modelVelocity.y + modelVelocity.z) / 3, 0), 0);
	$('#speed').text(speed);

	// Resetting the position along x, y and z axes
	modelPosition.x += (modelVelocity.x * multiplyPosition);
	modelPosition.y += (modelVelocity.y * multiplyPosition);
	modelPosition.z += (modelVelocity.z * multiplyPosition);
	/*
	if (modelPosition.y < 0) {
		modelPosition.y = 0;
	}
 */
	// Rounding the position values along x, y and z axes
	modelPosition.x = round(modelPosition.x);
	modelPosition.y = round(modelPosition.y);
	modelPosition.z = round(modelPosition.z);

	// Update model angle if rotation left or right is triggered
	if (movement.rotateLeft) {
		modelAngle += 1 * multiplyRotation * delta;
	}
	if (movement.rotateRight) {
		modelAngle -= 1 * multiplyRotation * delta;
	}
	// Check if model velocity along x and z is not zero
	if (Math.round(modelVelocity.x) != 0 && Math.round(modelVelocity.x) != 0) {
		// Animate rotation of the model over 2 seconds with elastic ease
		var angle = Math.atan2(modelPosition.x - model.position.x, modelPosition.z - model.position.z);
		var normalizedAngle = (-(angle + Math.PI) / (2 * Math.PI) * 360);
		normalizedAngle = round(((normalizedAngle + 360) % 360), 0);
		modelPosition.r = round(angle, 2);

		TweenLite.to(model.rotation, 2, {
			y: modelPosition.r,
			ease: Elastic.easeOut,
			onUpdate: function () {
				if (model.rotation.y > Math.PI) {
					model.rotation.y -= 2 * Math.PI;
				} else if (model.rotation.y < -Math.PI) {
					model.rotation.y += 2 * Math.PI;
				}
			},
		});

		// Animate position of the model over 2 seconds with elastic ease
		TweenLite.to(model.position, 2, {
			x: modelPosition.x,
			y: modelPosition.y,
			z: modelPosition.z,
			ease: Elastic.easeOut
		});
		// Update position of the body
		body.position.x = model.position.x;
		body.position.y = model.position.y;
		body.position.z = model.position.z;
		// model.position.copy(body.position);
		//body.velocity.copy(pos);
		//model.position.copy(body.position);
		//model.quaternion.copy(body.quaternion);

	}
}


function coordinatesBetween(target, target_2) {
	var deltaZ = target.z - target_2.z;
	var invertDeltaZ = target_2.z - target.z;
	var deltaX = target_2.x - target.x;
	var deltaY = target_2.y - target.y;
	distanceFromTarget = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2) + Math.pow(deltaZ, 2));
	var rotationAngleXZ = (Math.atan2(deltaX, deltaZ)) * 180 / Math.PI;
	if (rotationAngleXZ < 0) {
		rotationAngleXZ += 360;
	}
	var rotationAngleXY = (Math.atan2(deltaX, deltaY)) * 180 / Math.PI;
	if (rotationAngleXY < 0) {
		rotationAngleXY += 360;
	}
	if (rotationAngleZY < 0) {
		rotationAngleZY += 360;
	}
	var rotationAngleZY = (Math.atan2(deltaZ, deltaY)) * 180 / Math.PI;
	return {
		position: {
			z: Math.round(invertDeltaZ, 2),
			x: Math.round(deltaX, 2),
			y: Math.round(deltaY, 2),
		},
		distance: Math.abs(Math.round(distanceFromTarget, 2)),
		rotation: {
			xz: Math.round(rotationAngleXZ, 2),
			xy: Math.round(rotationAngleXY, 2),
			zy: Math.round(rotationAngleZY, 2),
		},
	};
}

function updatePosition(model) {
	model.model.position.copy(model.body.position);
	model.model.quaternion.copy(model.body.quaternion);
}