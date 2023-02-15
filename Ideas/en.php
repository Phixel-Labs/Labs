<?
	set_time_limit(500);
	ob_start(); // Start output buffering
	require('data.php');	// Include the contents fo data feed
	require('Parsedown.php');
?>


# We are Phixel

## Who we are
A team of specialized designers and developers with experience in unique digital solutions.

## About our ideas
Phixel has several ideas for new platforms and applications that cater to the growing demand for innovative solutions in various markets, such as VR/AR, sustainable economy, healthy habits, education, and localized markets. Some of the promising ideas include a short design and coding video series, an AR shopping app, a skills exchange platform, an organic delivery service, and a medication reminder app.

## Our skills
- Creation and production of promotional videos, animations and explanatory videos.
- Design and development of custom web pages for companies and organizations.
- Development of custom mobile applications for different operating systems.
- Development of online stores, e-commerce and e-commerce platforms.
- Consulting services in technology, digital strategy and data analysis.
- Production and editing of content for blogs, social networks and other digital media.
- Creation of online games and personalized educational applications.
- Development of plugins in WordPress

## Ideas
<?  

	echo "| Category | Status | Title | Description | Viability | Hours | Value | Total | \n";
	echo "| - | - | - | - | - | - | - | - |\n";
/*
	foreach($project as $key => $value){
		foreach($value as $key_1 => $value_1){
			$title_en = $value_1['en']['title'];
			$desc_en = $value_1['en']['description'];
			$viab_en = $value_1['en']['viability'];
			echo "| $key | $title_en | $desc_en | $viab_en |\n";		
		}	
	}
*/
	
	foreach($project as $key => $value){
		foreach($value as $key_1 => $value_1){
			$lang = 'en';
			$title = $value_1[$lang ]['title'];
			$desc = $value_1[$lang ]['description'];
			$viab = $value_1[$lang ]['viability'];
			$status = $value_1['status'];
			$hours = ($value_1['hours']);
			$value = ($value_1['value']);
			$total = ($hours * $value);
			echo "| $key | $status | $title | $desc | $viab | ".number_format($hours)." | $".number_format($value)." | $".number_format($total)." |\n";		
		}	
	}
?>



<?php
	$html = ob_get_clean(); // Get the contents of the output buffer and clear it	
	$html = trim($html); // Remove any whitespace from the beginning and end of the HTML
	file_put_contents('en.md', $html);// Write the HTML to a file named 'index.html'

	$Parsedown = new Parsedown();
	echo $Parsedown->text($html);
?>