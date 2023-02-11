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
	$data['tips'] [] = "Stay alert and keep a close eye on the radar, the invader is always on the move!";
	$data['tips'] [] = "Don't be afraid to take risks, sometimes it's the only way to catch the invader!";
	$data['tips'] [] = "Remember, it's a game of cat and mouse. Keep changing your strategy to stay one step ahead.";
	$data['tips'] [] = "Don't let the invader get too close, or it may be game over!";
	$data['tips'] [] = "Don't let the invader lure you into a trap, stay focused and drive with caution!";
	$data['tips'] [] = "Drive with precision and make every move count. Every second counts when catching the invader!";
	$data['tips'] [] = "The key to victory is a balance between speed and control.";
	$data['tips'] [] = "Collect power-ups for a boost and give yourself an advantage.";
	$data['tips'] [] = "Keep your cool and stay focused, you never know what's around the next corner.";
	$data['tips'] [] = "Don't give up, with determination and practice, you'll get the hang of it.";
	$data['tips'] [] = "Stay alert, the invader is always on the move and ready to pounce.";
	$data['tips'] [] = "The road ahead may be treacherous, but with quick reflexes and a steady hand, you'll make it to the finish line.";
	$data['tips'] [] = "Every journey has its challenges, but keep pushing forward, the reward is worth it.";
	$data['tips'] [] = "Drive with style and leave your mark on the road.";
	$data['tips'] [] = "This is not a race! Just cath the invader.";
	$data['tips'] [] = "Stay alert and aware of your surroundings at all times.";
	$data['tips'] [] = "Keep your eyes on the road ahead, and be prepared to dodge obstacles.";
	$data['tips'] [] = "Stay focused, the invader is quick and unpredictable, be ready for anything.";
	$data['tips'] [] = "Remember to take turns carefully, too much speed can cause you to lose control.";
	$data['tips'] [] = "Drive aggressively, but always maintain control of your vehicle.";
	$data['tips'] [] = "Don't be afraid to try new strategies, sometimes the unexpected can lead to success.";
	$data['tips'] [] = "Drive with confidence, but don't get too overconfident, the invader is always lurking.";
	$data['tips'] [] = "The road ahead is full of surprises, be prepared for anything and everything.";
	$data['tips'] [] = "Drive fast, but drive smart, it takes both speed and strategy to win.";
	$data['tips'] [] = "Don't let the invader get too far ahead, stay on its tail and never give up.";
	$data['tips'] [] = "Stay focused, the invader is quick and nimble, be ready for it to make sudden moves.";
	$data['tips'] [] = "Don't let the invader get the upper hand, stay alert and always be one step ahead.";


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