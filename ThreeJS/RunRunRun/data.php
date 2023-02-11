<?php
	// Seo data
	$data = [
		'title' => 'Run Run Run! 🚗',
		'description' => "Get behind the wheel and speed through the landscape in a high-stakes chase. Catch the invader and outmaneuver it at every turn.",
		'keywords' => '3D car game, car racing, car destruction, ThreeJS, CannonJS, GSAP',
		'copyright' => "Phixel",
		'url' => "https://phixel.net/samples/run-run-run",
	];
	// Text of page (instructions and introduction)
	$data['instructions'] = "
		<b>Yo!</b> Drive with the <br>
		<b>
			<span class='key'>W</span>
			<span class='key'>A</span>
			<span class='key'>S</span>
			<span class='key'>D</span>
		</b><br>
		keys, collect fuel ⛽ before time's up! 🕒<br>
		Catch the invader 👿 and dont let if catch you!<br>
		So what are you waiting for? Let's go! 🏁
	";
	$data['intro'] = "
		<h2>Hey there speedster! ⚡</h2><br>
		<h3>Catch the invader 😡 and don't let it catch you first 🏅</h3>
		<p>Get ready for a thrilling journey through the landscape. </p>
		<p>Take control of the wheel and demonstrate your driving abilities as you maneuver around.<br>
		This is not a typical drive, so fasten your seatbelt and get ready for an exciting ride!</p>
	";
	$data['start'] = "Let's run! 🥇";

	$data['color'] = "Vibrant Hues!";
	$data['subColor'] = "A Transformed World!";
	$data['mainColor'] = "Revamp the Interface!";
	// Add tips for game play
	$data['tips'] [] = "Accelerate and show off your skills!";
	$data['tips'] [] = "Keep an eye on your gas tank, it's running low!";
	$data['tips'] [] = "The real challenge starts now!";
	$data['tips'] [] = "Speed and control are equally important!";
	$data['tips'] [] = "Don't let obstacles slow you down, keep pushing forward!";
	$data['tips'] [] = "Put your driving skills to the test with the tricky turns!";
	$data['tips'] [] = "You've got a limited time, can you make it to the the next gas tank?!";
	$data['tips'] [] = "There's very little time, are you brave enough to make it?";
	$data['tips'] [] = "Stay focused and be ready for anything!";
	$data['tips'] [] = "Drive with cool and confidence!";
	$data['tips'] [] = "It's all about having a great time an winning!";
	$data['tips'] [] = "The journey may be tough, but the reward is worth it!";
	$data['tips'] [] = "Drive fast, no need for safely, and drive like a pro!";
	$data['tips'] [] = "You got this! Show the world what you're made of!";
	$data['tips'] [] = "It's not just about the time, it's about the excitement of the ride!";
	$data['tips'] [] = "The need for speed is calling, answer the call and show off your skills on the road!";
	$data['tips'] [] = "Rev up your engine and unleash your full speed potential! Show the road who's boss!";
	$data['tips'] [] = "Time is running out, step on the gas and make every second count towards reaching the next gas tank!";
	// create array with locations od 3D models
	$models_dir='media/model/';
	$models_files = scandir($models_dir);
	foreach ($models_files as $key => $value) {
		if ($value != '.' && $value!= '..') {
			$file = explode('.',$value);
			$data['models'][strtolower($file[0])][$file[1]] = $models_dir.$value;
		}
	}	
?>