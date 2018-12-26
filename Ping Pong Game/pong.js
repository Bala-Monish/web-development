var game = false;
var movement ={};
var move_right = true;
var move_down = true;
var ball_speed = 30;
var score = 0;

var st_btn = document.createElement("BUTTON");
st_btn.setAttribute('id','start_button');
var txt = document.createTextNode("Start Game");
st_btn.appendChild(txt);
document.body.appendChild(st_btn);
document.getElementById("start_button").style.margin = '5px';
document.getElementById("start_button").addEventListener("click",startGame);

var rst_btn = document.createElement("BUTTON");
rst_btn.setAttribute('id','restart_button');
var tx = document.createTextNode("Reset Game");
rst_btn.appendChild(tx);
document.body.appendChild(rst_btn);
document.getElementById("restart_button").addEventListener("click",restartGame);

var ball_speed_slow = document.createElement('input') ;
ball_speed_slow.setAttribute('type', 'radio') ;
ball_speed_slow.setAttribute('id', 'slow') ;
ball_speed_slow.setAttribute('name','spd');
ball_speed_slow.checked = true ;
ball_speed_slow.onchange =slowspeed;


var ball_speed_medium = document.createElement('input') ;
ball_speed_medium.setAttribute('type', 'radio') ;
ball_speed_medium.setAttribute('id', 'medium') ;
ball_speed_medium.setAttribute('name','spd');
ball_speed_medium.onchange = mediumspeed;


var ball_speed_fast = document.createElement('input') ;
ball_speed_fast.setAttribute('type', 'radio') ;
ball_speed_fast.setAttribute('id', 'fast') ;
ball_speed_fast.setAttribute('name','spd');
ball_speed_fast.onchange = fastspeed;


var slow_label = document.createElement('label') ;
slow_label.appendChild(document.createTextNode('Slow')) ;

var medium_label = document.createElement('label') ;
medium_label.appendChild(document.createTextNode('Medium')) ;

var fast_label = document.createElement('label') ;
fast_label.appendChild(document.createTextNode('Fast')) ;


var court = document.createElement("div");
court.setAttribute('class','court');


var ball = document.createElement("div");
ball.setAttribute('id','ball');

var paddle = document.createElement('div');
paddle.setAttribute('id','paddle');

function startGame(){
	if(game == false){
		restartGame();
		game = true;
	}
	else{
		return;
	}
	game =true;
	movement = window.setInterval(trackBall,ball_speed);
}
function restartGame() {
	ball.style.top = '60px' ;
    ball.style.left = '5px' ;
    directionRight = true, directionDown = true ;
    clearInterval(movement) ;
    game = false ;
}
function slowspeed(){
  
    ball_speed = 40;
    clearInterval(movement) ;
    movement = setInterval(trackBall, ball_speed) ;
}
function mediumspeed(){

    ball_speed = 25;
    clearInterval(movement) ;
    movement = setInterval(trackBall, ball_speed) ;
}
function fastspeed(){
    ball_speed = 12;
    clearInterval(movement) ;
    movement = setInterval(trackBall, ball_speed) ;
}
function trackBall(){ 
	const courtPosition = court.getBoundingClientRect();  
if (ball.getBoundingClientRect().right >= courtPosition.right )
	{ alert("Game Over.....Score is :"+score) ;
	clearInterval(movement) ; }

if (ball.getBoundingClientRect().right >= paddle.getBoundingClientRect().left ){
	if (( ball.getBoundingClientRect().bottom <= paddle.getBoundingClientRect().bottom)&&( ball.getBoundingClientRect().bottom >= paddle.getBoundingClientRect().top))
	{
		directionRight = false;
		score++;
	}
}
else if(courtPosition.left > ball.getBoundingClientRect().left)
	{ directionRight = true ; }
else if (courtPosition.top >= ball.getBoundingClientRect().top)
	{ directionDown = true ; } 
else if(courtPosition.bottom <= ball.getBoundingClientRect().bottom)
	{ directionDown = false ; } 
if(directionRight) {
	ball.style.left = (parseInt(ball.style.left)+10)+'px' ; 
}
else 
	ball.style.left = (parseInt(ball.style.left)-10)+'px'; 
if(directionDown) 
	ball.style.top = (parseInt(ball.style.top)+10)+'px' ;
 else 
 	ball.style.top = (parseInt(ball.style.top)-10)+'px'; 
}

court.addEventListener('mousemove',function(e){
	var xpos =e.pageX;
	var ypos = e.pageY;

	paddle.style.top = (parseInt(ypos))+ 'px';
	paddle.style.bottom =(parseInt(xpos))+'px';
});	

document.body.appendChild(ball);
document.body.appendChild(paddle);
document.body.appendChild(ball_speed_slow);
document.body.appendChild(slow_label) ;
document.body.appendChild(ball_speed_medium);
document.body.appendChild(medium_label) ;
document.body.appendChild(ball_speed_fast);
document.body.appendChild(fast_label) ;
document.body.appendChild(court);

