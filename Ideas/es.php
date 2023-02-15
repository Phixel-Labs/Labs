<?
	set_time_limit(500);
	ob_start(); // Start output buffering
	require('data.php');	// Include the contents fo data feed
	require('Parsedown.php');
?>


# Somos Phixel

## Quienes somos
Un equipo de diseñadores y desarrolladores especializados con experiencia en soluciones digitales únicas.

## Sobre nuestras ideas
Phixel tiene varias ideas para nuevas plataformas y aplicaciones que satisfacen la creciente demanda de soluciones innovadoras en diversos mercados, como la realidad virtual/aumentada, la economía sostenible, los hábitos saludables, la educación y los mercados locales. Algunas de las ideas prometedoras incluyen una serie corta de videos de diseño y codificación, una aplicación de compras de realidad aumentada, una plataforma de intercambio de habilidades, un servicio de entrega orgánica y una aplicación recordatoria de medicamentos.

### Nuestras habilidades
- Creación y producción de videos promocionales, animaciones y videos explicativos.
- Diseño y desarrollo de páginas web personalizadas para empresas y organizaciones.
- Desarrollo de aplicaciones móviles personalizadas para diferentes sistemas operativos.
- Desarrollo de tiendas en línea, e-commerce y plataformas de comercio electrónico.
- Servicios de consultoría en tecnología, estrategia digital y análisis de datos.
- Producción y edición de contenido para blogs, redes sociales y otros medios digitales.
- Creación de juegos en línea y aplicaciones educativas personalizadas.
- Desarrollo de plugins en WordPress

## Ideas

<?  

	echo "| Categoría | Estado | Título | Descripción | Viabilidad | Horas | Valor | Total | \n";
	echo "| - | - | - | - | - | - | - | - |\n";

	
	foreach($project as $key => $value){
		foreach($value as $key_1 => $value_1){
			$lang = 'es';
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

	/*
	
----------
Necesitamos ideas innovadoras que vender en el mercado, que se puedan hacer rápidamente y que no existan el mercado.
Nos puedes ayudar?

	
	*/
?>





<?php
	$html = ob_get_clean(); // Get the contents of the output buffer and clear it	
	$html = trim($html); // Remove any whitespace from the beginning and end of the HTML
	file_put_contents('es.md', $html);// Write the HTML to a file named 'index.html'

	$Parsedown = new Parsedown();
	echo $Parsedown->text($html);
?>