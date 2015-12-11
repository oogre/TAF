<?php
    $pdf = new PDFlib();
    $pdf->begin_document("","");
    $pdf->set_info("Creator","images.php");
    $pdf->set_info("Title","Horizontal and Vertical Example");
    // Width of 612, and length of 792 make US Letter Size
    // Dimensions are reversed for Landscape Mode
    $pdf->begin_page_ext(792,612,'');

    $font = $pdf->load_font("Helvetica-Oblique", "iso8859-1", "");
    $pdf->setfont($font, 18);
    $pdf->show_xy("This is horizontal text",50, 300);
    $pdf->rotate(90); /* rotate coordinates */
    $pdf->show_xy("vertical text",300, -400);
  
    $pdf->rotate(-90); /* rotate coordinates */;
    $pdf->show_xy("This is horizontal text",50, 400);

    $pdf->end_page_ext("");
    $pdf->end_document("");
    $buf = $pdf->get_buffer();
    $len = strlen($buf);
    Header("Content-type: application/pdf");
    Header("Content-Length: $len");
    Header("Content-Disposition: inline; filename=images.pdf");
    echo $buf;
    $pdf->delete();
?>