<?php
//============================================================+
// File name   : example_013.php
// Begin       : 2008-03-04
// Last Update : 2013-05-14
//
// Description : Example 013 for TCPDF class
//               Graphic Transformations
//
// Author: Nicola Asuni
//
// (c) Copyright:
//               Nicola Asuni
//               Tecnick.com LTD
//               www.tecnick.com
//               info@tecnick.com
//============================================================+

/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: Graphic Transformations
 * @author Nicola Asuni
 * @since 2008-03-04
 */

// Include the main TCPDF library (search for installation path).
require_once('tcpdf_include.php');

// Extend the TCPDF class to create custom Header and Footer
class MYPDF extends TCPDF {

	//Page header
	public function Header() {
		// Logo
		$image_file = "/var/www/TAF/.demeteorized/bundle/programs/web.browser/app/images/adf-logo.png";
		$this->Image($image_file, 5, 5, 90, '', 'PNG', '', 'T', false, 300, '', false, false, 0, false, false, false);
	}

	// Page footer
	public function Footer() {
		// Position at 15 mm from bottom
		$this->SetY(-23);
		
		$style = array('width' => 0.7, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0));
		$this->Line(5, $this->GetY(), $this->GetPageWidth()-5, $this->GetY(), $style);

		$this->SetY(-20);
		$this->MultiCell(44, 4, "<b>Atelier</b><br/><br/>rue des technologies 2ter<br/>B-4432 Alleur", 0, 'L', 0, 0, '', '', true, 0, true);
		$this->MultiCell(44, 4, "<b>Téléphone & Fax</b><br/><br/>Fixe : 04 366.13.18<br/>Fax : 04 239.20.89", 0, 'L', 0, 0, '', '', true, 0, true);
		$this->MultiCell(44, 4, "<b>Service Technique</b><br/><br/>0495.51.43.09<br/>0495.48.68.96", 0, 'L', 0, 0, '', '', true, 0, true);
		$this->MultiCell(44, 4, "<b>Internet</b><br/><br/>Mail : info@atelierdufroid.be<br/>Site : www.atelierdufroid.be", 0, 'L', 0, 2, '' ,'', true, 0, true);
	}
}


// create new PDF document
$pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);


// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Vincent Evrard');
$pdf->SetTitle('TAF : ');
$pdf->SetSubject('fiche de maintenance');


// set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 013', PDF_HEADER_STRING);

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
	require_once(dirname(__FILE__).'/lang/eng.php');
	$pdf->setLanguageArray($l);
}

// ---------------------------------------------------------

$modules = json_decode($_GET["modules"]);
$tasks = json_decode($_GET["tasks"]);


// add a page
$pdf->AddPage();


// Start Transformation

// Rotate 20 degrees counter-clockwise centered by (70,110) which is the lower left corner of the rectangle


$pdf->StartTransform();
	$pdf->Translate(5, 70);
	$pdf->StartTransform();
		$pdf->Translate(50, 0);
		$pdf->SetFont(null, null, 10);
		foreach ($tasks as $key => $task)
		{
			$pdf->StartTransform();
				$pdf->Translate(10 * $key, 0);
				$pdf->Rotate(45, 0, 0);
				$pdf->Text(0, 0, $task);
			$pdf->StopTransform();
		}
	$pdf->StopTransform();
	// Stop Transformation
	$pdf->SetFont(null, null, 8);
	$pdf->Ln();
	foreach($modules as $module) {
		$pdf->Cell(33, 6, $module[0], 'RTB', 0, 'R');
		foreach($module as $k => $task) {
			if($k == 0)continue;
			$pdf->Cell(10, 6, $task, 'TB', 0, 'C');	
		}
		$pdf->Ln();
	}

$pdf->StopTransform();


error_log($_GET["dest"].$_GET["filename"]);

//Close and output PDF document
$pdf->Output($_GET["dest"].$_GET["filename"], 'F');



header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
print_r(json_encode("/upload/pdf/".$_GET["filename"]));
exit();
