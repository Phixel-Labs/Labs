<?php
	ob_start();
	require('data.php');
?>

<html>
	<head>
		<!-- character encoding -->
		<meta charset="UTF-8">
		<!-- title, description, keywords, author, and copyright -->
		<title>
			<?php echo $data['title']; ?>
		</title>
		<meta name="description" content="<?php echo $data['description']; ?>">
		<meta name="keywords" content="<?php echo $data['keywords']; ?>">
		<meta name="author" content="<?php echo $data['copyright'] ?>">
		<meta name="copyright" content="<?php echo $data['copyright']; ?> | © <?php echo date('Y'); ?> ">
		<link rel="canonical" href="<?php echo $data['url']; ?>">
		<!-- viewport setting -->
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<!-- search engine visibility -->
		<meta name="robots" content="index, follow">
		<!-- CSS stylesheet -->
		<link rel="stylesheet" type="text/css" href="css/reset.css">
		<link rel="stylesheet" type="text/css" href="css/styles.css">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
		<!-- JS dependencies -->
		<?php
			$dependencies['cloudflare'] ='https://cdnjs.cloudflare.com/ajax/libs';
			$dependencies['unpkg'] ='https://unpkg.com';

			$lib['cloudflare']['jquery']='jquery/3.6.3/jquery.min.js';
			$lib['cloudflare']['gsap']='gsap/3.11.4/gsap.min.js';
			$lib['cloudflare']['threeJS']='three.js/r119/three.min.js';
			$lib['unpkg']['GLTFLoader']='three@0.126.0/examples/js/loaders/GLTFLoader.js';
			$lib['cloudflare']['cannonJS']='cannon.js/0.6.2/cannon.min.js';
			$lib['cloudflare']['toneJS']='tone/14.8.49/Tone.js';
			// $lib['cloudflare']['dat-gui']='dat-gui/0.7.9/dat.gui.min.js';
			// $lib['cloudflare']['chromaJS']='chroma-js/2.4.2/chroma.min.js';

			foreach($lib as $key => $value ){
				foreach($value as $key_ => $value_ ){					
					echo '<script src="'.$dependencies[$key].'/'.$value_.'" id="'.$key_.'"></script>'."\n";
				}
			}
		?>

		<!-- JS custom scripts -->
		<script src="./scripts/functions.js"></script>
		<script src="./scripts/3js-functions.js"></script>
		<script src="./scripts/3js-setup.js" defer></script>
		<script defer>
			var tips = [ 
				<?php
					foreach($data['tips'] as $key => $value) {
						echo '"'.$value.'",';
					} 
				?>
			];
			var models={};
			<?php
				foreach($data['models'] as $key => $value) {
					echo 'models.'.$key.' = {';
					foreach($value as $key_ => $value_) {
						echo '"'.$key_.'" : "'.$value_.'",';
					} 
					echo '};'."\n";
				}
			?>

			function showTip() {
				const randomTip = tips[Math.floor(Math.random() * tips.length)];
				$('#tips').text(randomTip);
			}
			showTip();
			setInterval(showTip, 10000);
		</script>
	</head>

	<body>
		<!-- container -->
		<div id="start">
			<div class="content">
				<h1>
					<?php echo $data['title']; ?>
				</h1>
				<p clsss="intro">
					<?php echo $data['intro']; ?>
				</p>
				<button onclick="render(); $('#start').addClass('hidden'); $('#container').removeClass('hidden');" class="button">
					<?php echo $data['start']; ?>
				</button>
			</div>
		</div>
		<div id="container" class="hidden">
			<!-- sidebar -->
			<div id="sidebar">
				<div>
					<h1>
						<?php echo $data['title']; ?>
					</h1>
					<!-- hide on mobile -->
					<div class="hidder">
						<p class="instructions">
							<?php echo $data['instructions']; ?>
						</p>
						<h2>
							<?php echo $data['color']; ?>
						</h2>
						<h3>
							<?php echo $data['subColor']; ?>
						</h3>
						<div id="subColor" class="colors"></div>
						<h3>
							<?php echo $data['mainColor']; ?>
						</h3>
						<div id="mainColor" class="colors"></div>
					</div>
				</div>
			</div>
			<!-- content -->
			<div id="content">
				<div id="scene"></div>
				<div id="radar">
					<div id="direction">
						<div id="arrow" class="material-symbols-outlined">straight</div>
						<div id="distance"></div>
					</div>
				</div>
				<div id="info">
					<div>
						<span id="speed"></span>
						km
					</div>
					<div id="tips"></div>
					<div id="coords" class="hidden"></div>
				</div>
			</div>
			<!-- sidebar toggler -->
			<button id="hide-sidebar" onclick="document.body.classList.toggle('fullsize');">
				<span class="material-symbols-outlined">hide</span>
			</button>
		</div>
	</body>
</html>
<?
	$html = ob_get_clean();
	$html = trim($html);
	file_put_contents('index.html', $html);
	echo $html;
?>