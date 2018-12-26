<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	<?php

// display all errors on the browser
error_reporting(E_ALL);
ini_set('display_errors','On');



require_once 'demo-lib.php';
demo_init(); // this just enables nicer output

// if there are many files in your Dropbox it can take some time, so disable the max. execution time
set_time_limit( 0 );

require_once 'DropboxClient.php';

/** you have to create an app at @see https://www.dropbox.com/developers/apps and enter details below: */
/** @noinspection SpellCheckingInspection */
$dropbox = new DropboxClient( array(
	'app_key' => "abc",      // Put your Dropbox API key here
	'app_secret' =>"xyz" ,   // Put your Dropbox API secret here
	'app_full_access' => false,
) );

$url ="https://" . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'] . "?auth_redirect=1";

//echo "The url is ",$url;
echo "<br>";
$bearer_token = demo_token_load( "bearer" );

if ( $bearer_token ) {
	$dropbox->SetBearerToken( $bearer_token );
	echo "loaded bearer token: " . json_encode( $bearer_token, JSON_PRETTY_PRINT ) . "\n";
} elseif ( ! empty( $_GET['auth_redirect'] ) ) // are we coming from dropbox's auth page?
{
	// get & store bearer token
	$bearer_token = $dropbox->GetBearerToken( null, $return_url );
	demo_store_token( $bearer_token, "bearer" );
} elseif ( ! $dropbox->IsAuthorized() ) {
	// redirect user to Dropbox auth page
	$auth_url = $dropbox->BuildAuthorizeUrl( $return_url );
	die( "Authentication required. <a href='$auth_url'>Continue.</a>" );
}


echo "<pre>";

?>
<form action ="" method = "post" enctype="multipart/form-data">
<div class = "file_insertion">
Insert File: <input type = "file" name = "input_file">
<br><br>
<button type="submit">Upload</button> 
</div>

<?php
	
	if(isset($_FILES['input_file'])&& !empty($_FILES['input_file']))
	{
		$file_tmp = $_FILES['input_file']['tmp_name'];
		$file_name = $_FILES['input_file']['name'];
		$dropbox->UploadFile($file_tmp, "/$file_name");
		echo "Thumbnail of current image\n";
		$img_data = base64_encode( $dropbox->GetThumbnail( "/$file_name" ) );
		echo "<img src=\"data:image/jpeg;base64,$img_data\" alt=\"Generating PDF thumbnail failed!\" style=\"border: 1px solid black;\" />\n";
		
	}
	echo "<pre>";
	$files = $dropbox->GetFiles( "", false );
	echo "\n\n<b>Files in Dropbox:</b>\n";	

	foreach ($files as $key =>$value) {
		echo "\n\nClick to Download: ";
		echo "\n\n<b> <a href='" . $dropbox->GetLink( $key,$preview=false) . "'>$key</a></b>\n";
		echo "<button type = 'submit' formaction=album.php?deleteid={$key}>Delete</button>\t";
		$img_data = base64_encode( $dropbox->GetThumbnail( "/$key" ) );
		echo "<img src=\"data:image/jpeg;base64,$img_data\" alt=\"Generating PDF thumbnail failed!\" style=\"border: 1px solid black;\" />";
		echo "<br>";
	}
	

if(isset($_GET['deleteid']))
		{	$delete = "/".$_GET['deleteid'];
			$dropbox->Delete($delete);
	}
?>
</form>
</body>
</html>

