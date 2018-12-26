
<html>
<head><title>Message Board</title></head>
<body>
<?php
session_start();
if(!isset($_SESSION['usr_nam']))
{
  $_SESSION['usr_nam']="";
}

$usr ="";
$pwd ="";
$dbusr="";
$dbpass="";
try {
  $dbh = new PDO("mysql:host=127.0.0.1:3306;dbname=board","root","",array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
  print_r($dbh);
  if(!empty($_POST['username'])&&!empty($_POST['password']) )
  {
    $usr = $_POST['username'];
    $pwd = md5($_POST['password']);
  }
  $dbh->beginTransaction();
  
  (print_r($dbh->errorInfo(), true));
  $dbh->commit();

  $stmt = $dbh->prepare('select * from users WHERE username ="' .$usr.  '"  AND password ="'.$pwd.'"');
  $stmt->execute();
  print "<pre>";
  while ($row = $stmt->fetch()) {
    $dbusr = $row['username'];
    $_SESSION['usr_nam'] = $row['username'];
    $dbpass = $row['password'];
  }
  if( ($dbusr == $usr) && ($dbpass == $pwd))
  {
    print "Validated";
  }
  else
   {
    header("location: http://localhost/project5/login.php");
    exit; 
  }
  print "</pre>";
} catch (PDOException $e) {
  print "Error!: " . $e->getMessage() . "<br/>";
  die();
}

?>
<form action ="" method = "post">
<div class = "textarea">

 Text Box: <input type="text" name="textmsg" style="width: 300px;height: 200px;">
  </div>
  
  <br>
  <button type = "submit" formaction="board.php"> NEW POST</button>
  
  <?php
    $msgid = uniqid();
    if(isset($_POST['textmsg'])&&(($_POST['textmsg'])!=""))
    {
      $txtmsg = $_POST['textmsg'];
        if(isset($_GET['replyid']))
          {
            
             $dbh->exec('insert into posts values("'.$msgid.'", "'.$_GET['replyid'].'" ,"'.$_SESSION['usr_nam']. '",now(),"'.$txtmsg.'")');
               }
        else  
               $dbh->exec('insert into posts values("'.$msgid.'", " " ,"'.$_SESSION['usr_nam']. '",now(),"'.$txtmsg.'")');
    }
  ?>

  <br>
  <br>
<?php
  $stmt = $dbh->prepare('select * from posts ORDER BY date_time DESC');
  $stmt->execute();
  print "<pre>";
  while ($row = $stmt->fetch()) {
    $repid = $row['id'];
     $stm = $dbh->prepare('select fullname,username from users where username = "'.$row['postedby'].'"');
     $stm->execute();
     $res = $stm->fetch();
     echo "Full name is :",$res['fullname'];
     echo "<br>";
     echo "User name is :",$res['username'];
     echo"<br>";
     echo "Message ID :",$repid;
     echo"<br>";
     echo "Reply to :",$row['replyto'];
     echo"<br>";
     echo "Time at insertion :",$row['date_time'];
     echo"<br>";
     echo "Message is :",$row['message'];
     echo"<br>";
     echo "<button type ='submit' formaction='board.php?replyid=$repid'>REPLY</button>";
     echo "<br>";
    }
?>
 
  </div>
<button type = "submit" formaction="http://localhost/project5/login.php" style =" position:fixed;   right:10px;   top:5px;">Logout</button>

</form>
</body>
</html>
