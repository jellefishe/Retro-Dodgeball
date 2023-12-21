// ===================== Fall 2021 EECS 493 Assignment 2 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==============================================
// ============ Page Scoped Globals Here ========
// ==============================================

// Div Handlers
let game_window;

// Game Object Helpers
let AST_OBJECT_REFRESH_RATE = 15;
let maxPersonPosX = 1218;
let maxPersonPosY = 658;
let PERSON_SPEED = 13;                // Speed of the person
let vaccineOccurrence = 20000;       // Vaccine spawns every 20 seconds
let vaccineGone = 5000;              // Vaccine disappears in 5 seconds
let maskOccurrence = 15000;          // Masks spawn every 15 seconds
let maskGone = 5000;                 // Mask disappears in 5 seconds
let maskCount = 0;
let playerMasked = 0;     //0:unmasked 1:masked
let where = 0;
let xSpd = 0;
let ySpd = 0;
let xSpd2 = 0;
let ySpd2 = 0;
let xSpd3 = 0;
let ySpd3 = 0;
let newPosx = 0;
let newPosy = 0;
let newPosy2=0;
let newPosx2 =0;
let newPosx3 = 0;
let newPosy3 = 0;
let isAlive = 1;
let vaccLevel = 1;
let danger_num = 10;
let spdMultiplier = 1;
let spwnMultiplier = 1;
let score = 0;
let start = 0;
let seenTutorial = 0;
let difficulty = 2;
let difficultySpdMult = 3;
let difficultySpwnMult = .8;
let volume = .10;
let cometIdx = 0;
let cometIdx3 = 2;
let cometIdx2 = 1;


// Movement Helpers
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;
var touched = false;
var isDiag = false;
var mAppended = false;
var vAppended = false;


// ==============================================
// ============ Functional Code Here ============
// ==============================================

// Main
$(document).ready(function () {
    // ====== Startup ====== 
    document.getElementById('player').style.display = 'none';
    document.getElementById('splashscreen').style.display = 'none';
    document.getElementById('actual_game').style.display = 'none';
    document.getElementById('death').style.display = 'none';
    document.getElementById('tutorial').style.display = 'none';
    document.getElementById('settingsPNL').style.display = 'none';
    // TODO: ADD MORE
    mainmenu();

    console.log("im ready");
    player = $("#player");
    game_window = $('.game-window');
    acutal_game = $('#actual_game');
    asteriod_sect = $('.asteroidSection');
});
function mainmenu(){
  document.getElementById('playBtn').addEventListener("click",PlayClicked);
  document.getElementById('settingsBtn').addEventListener("click",settingsClicked);
}
function settingsClicked(){ 
  settingsMode();
}
function settingsMode(){
  document.getElementById('settingsPNL').style.display = 'inline-block';
  setInterval(() => {
    if(difficulty==1){
      document.getElementById('hardBtn').style.borderColor = 'transparent';
      document.getElementById('normalBtn').style.borderColor = 'transparent';
      document.getElementById('easyBtn').style.borderColor = 'yellow';
      danger_num = 10;
    }
    if(difficulty==2){
      document.getElementById('hardBtn').style.borderColor = 'transparent';
      document.getElementById('normalBtn').style.borderColor = 'yellow';
      document.getElementById('easyBtn').style.borderColor = 'transparent';
      danger_num = 20;
    }
    if(difficulty==3){
      document.getElementById('hardBtn').style.borderColor = 'yellow';
      document.getElementById('normalBtn').style.borderColor = 'transparent';
      document.getElementById('easyBtn').style.borderColor = 'transparent';
      danger_num = 30;
    }
    document.getElementById('volumeId').innerHTML = document.getElementById('myRange').value;
    volume = (document.getElementById('myRange').value)/1000;
  }, 5);
  document.getElementById('closeBtn').style.border = 'none';
  document.getElementById('closeBtn').addEventListener("click",closeClicked);
  document.getElementById('easyBtn').addEventListener("click",easyClicked);
  document.getElementById('normalBtn').addEventListener("click",normalClicked);
  document.getElementById('hardBtn').addEventListener("click",hardClicked);
}

function easyClicked(){
  difficulty = 1;
  difficultySpdMult=1;
  difficultySpwnMult= 1;
}

function normalClicked(){
  difficulty = 2;
  difficultySpdMult=3;
  difficultySpwnMult= .8;
}

function hardClicked(){
  difficulty = 3;
  difficultySpdMult=5;
  difficultySpwnMult= .6;
}


function closeClicked(){ 
  document.getElementById('settingsPNL').style.display = 'none';
}
function PlayClicked(){ 
  if(!seenTutorial){
    document.getElementById('tutorial').style.display = 'inline-block';
    document.getElementById('startBtn').addEventListener("click",startClicked);
  }
  else{
    restartgame();
  }
}

function restartgame(){
  isAlive = 1;
  document.getElementById('main').style.display = 'none';
  document.getElementById('player').style.display = 'none';
  document.getElementById('tutorial').style.display = 'none';
  document.getElementById('splashscreen').style.display = 'inline-block';
  document.getElementById('actual_game').style.display = 'inline-block';
  console.log(document.getElementById('actual_game').backgroundColor);
  if(difficulty == 1){
    danger_num =10;
  }
  if(difficulty == 2){
    danger_num =20;
  }
  if(difficulty == 3){
    danger_num =30;
  }
  //startGame();
}

function StartOverClicked(){ 
  document.getElementById('main').style.display = 'inline-block';
  document.getElementById('death').style.display = 'none';
  document.getElementById('death').style.visibility = 'hidden';
  mainmenu();
}
function startClicked(){ 
  startGame();
} 
function deathscreen(){
  document.getElementById('startOverBtn').addEventListener("click",StartOverClicked);
  document.getElementById('death').style.display = 'inline-block';
  document.getElementById('scoreId').style.display = 'inline-block';
  document.getElementById('actual_game').style.visibility = 'hidden';
  document.getElementById('scoreId').innerHTML = score;
}
function startGame(){
  seenTutorial = 1;
  start = 1;
  document.getElementById('tutorial').style.display = 'none';
  document.getElementById('splashscreen').style.display = 'inline-block';
  document.getElementById('actual_game').style.display = 'inline-block';
  document.getElementById('main').style.display = 'none';

  setTimeout(() => {
    setInterval(function(){
      if(isAlive){
        spawnComets();
      }
    }, 3000*difficultySpwnMult);
    CometId = $('#Comet'+cometIdx);
    setInterval(() => {
      if(isAlive){
        moveComet(CometId,cometIdx,xSpd,ySpd);
      }
    }, AST_OBJECT_REFRESH_RATE/difficultySpdMult);

    setInterval(function(){
      setTimeout(function(){
        if(isAlive){
          spawnComets2();
        }
      }, 1000);
    }, 3000*difficultySpwnMult);
    CometId2 = $('#Comet2'+cometIdx2);
    setInterval(() => {
      if(isAlive){
        moveComet2(CometId2,cometIdx2,xSpd2,ySpd2);
      }
    }, AST_OBJECT_REFRESH_RATE/difficultySpdMult);
    setInterval(function(){
      setTimeout(function(){
        if(isAlive){
          spawnComets3();
        }
      }, 2000);
    }, 3000*difficultySpwnMult);
    CometId3 = $('#Comet3'+cometIdx3);
    setInterval(() => {
      if(isAlive){
        moveComet3(CometId3,cometIdx3,xSpd3,ySpd3);
      }
    }, AST_OBJECT_REFRESH_RATE/difficultySpdMult);
  },3000);


  setTimeout(function() {
    startPlaying();
    //document.getElementsByClassName('CometClass').style.display = 'inline-block';
  }, 3000);


  setInterval(function(){
    if(!isAlive){
      setTimeout(() => {
        //document.getElementById('player').style.display = 'none';
        deathscreen();
      }, 2000);
    }
  },50);


  setInterval(function(){
    document.getElementById('covid_level').innerHTML = vaccLevel;
    document.getElementById('covid_danger_num').innerHTML = danger_num;
    document.getElementById('score_num').innerHTML = score;
  },50);
  
  setTimeout(function() {
    setInterval(function() {
      if(isAlive){
        checkMovement();
      }
    }, 25);
  }, 2900);
  setTimeout(()=>{
    setInterval(function(){
      checkCollisions();
    }, 100);
  },3000);
}
function startPlaying(){
  document.getElementById('player').style.position = 'abosolute';
  document.getElementById('player').style.left = '50%';
  document.getElementById('player').style.top = '50%';
    setInterval(function(){
      if(isAlive){
        score += 40;
      }
    },500);
    document.getElementById('player').style.display = 'inline-block';
    document.getElementById('splashscreen').style.display = 'none';
  let str = "<div id='mask' class='Masks'><img src='src/mask.gif'/></div>";
  acutal_game.append(str);
  document.getElementById('mask').style.display = 'none';
  mAppended = true;
  mask = $('#mask');
  let stri = "<div id='VaccId' class='VaccClass'><img src='src/vacc.gif'/></div>";
  acutal_game.append(stri);
  vAppended = true;
  document.getElementById('VaccId').style.display = 'none';
  VaccId = $('#VaccId');
  setInterval(function(){
    if(isAlive){
      spawnMask();
    }
  },maskOccurrence);
  setInterval(function(){
    if(isAlive){
      spawnVacc();
    }
  },vaccineOccurrence);

}
function spawnComets3(){
  let xEnd3 = 0;
  let xStart3 = 0;
  let yEnd3 = 0;
  let yStart3 = 0;
  let speed3 = 10;
  let constant3 = 0;
    cometIdx3 = cometIdx3 +1;
    var stri = "<div id='Comet3"+cometIdx3+"' class='CometClass'><img src='src/covidstriod.png'/></div>";
    asteriod_sect.append(stri); 
    CometId3 = $('#Comet3'+cometIdx3);
    
    let where3 = cometIdx3 % 4;
    if(where3 <= 0){
      xEnd3 = getRandomNumber(0,maxPersonPosX);
      xStart3 = getRandomNumber(0,maxPersonPosX);
      xSpd3 = xEnd3-xStart3;
      ySpd3 = maxPersonPosY;
      speed3 = Math.sqrt(xSpd3*xSpd3 + ySpd3*ySpd3);
      constant3 = speed3/maxPersonPosY;
      xSpd3 = xSpd3/constant3;
      CometId3.css("left",xStart3);
      CometId3.css("top",0);
  
    }
    else if(where3 == 1){
      xEnd3 = getRandomNumber(0,maxPersonPosX);
      xStart3 = getRandomNumber(0,maxPersonPosX);
      xSpd3 = xEnd3-xStart3;
      ySpd3 = maxPersonPosY;
      speed3 = Math.sqrt(xSpd3*xSpd3 + ySpd3*ySpd3);
      constant3 = speed3/maxPersonPosY;
      xSpd3 = xSpd3/constant3;
      CometId3.css("left",xStart3);
      CometId3.css("top",maxPersonPosY);
    }
    else if(where3 == 2){
      yEnd3 = getRandomNumber(0,maxPersonPosY);
      yStart3 = getRandomNumber(0,maxPersonPosY);
      ySpd3 = yEnd3-yStart3;
      xSpd3 = maxPersonPosX;
      speed3 = Math.sqrt(xSpd3*xSpd3 + ySpd3*ySpd3);
      constant3 = speed3/maxPersonPosX;
      ySpd3 = ySpd3/constant3;
      CometId3.css("top",yStart3);
      CometId3.css("left",0);
    }
    else {
      yEnd3 = getRandomNumber(0,maxPersonPosY);
      yStart3 = getRandomNumber(0,maxPersonPosY);
      ySpd3 = yEnd3 - yStart3;
      xSpd3 = maxPersonPosX;
      speed3 = Math.sqrt(xSpd3*xSpd3 + ySpd3*ySpd3);
      constant3 = speed3/maxPersonPosX;
      ySpd3 = ySpd3/constant3;
      CometId3.css("top",yStart3);
      CometId3.css("left",maxPersonPosX);
    } 
  }

function moveComet3(CometId3,where,xSpeed,ySpeed){

  if(cometIdx3 %4 <=0 ){
    newPosx3 = parseInt(CometId3.css("left")) + spdMultiplier* xSpeed/140;
    newPosy3 = parseInt(CometId3.css("top")) + spdMultiplier*ySpeed/140;
  }
  else if(cometIdx3 %4 == 1 ){
    newPosx3 = parseInt(CometId3.css("left")) + spdMultiplier*xSpeed/140;
    newPosy3 = parseInt(CometId3.css("top")) - spdMultiplier*ySpeed/140;
  }
  else if(cometIdx3 %4 == 2 ){
    newPosx3 = parseInt(CometId3.css("left")) + spdMultiplier*xSpeed/140;
    newPosy3 = parseInt(CometId3.css("top")) + spdMultiplier*ySpeed/140;
  }
  else if(cometIdx3 %4==3){
    newPosx3 = parseInt(CometId3.css("left")) - spdMultiplier*xSpeed/140;
    newPosy3 = parseInt(CometId3.css("top")) + spdMultiplier*ySpeed/140;
  }
  CometId3.css("top",newPosy3);
  CometId3.css("left",newPosx3);

  if( parseInt(CometId3.css("left") < 0) || (parseInt(CometId3.css("left")) > maxPersonPosX) ){
    document.getElementById('Comet3'+cometIdx3).style.display = 'none';
  }
  if(parseInt(CometId3.css("top") < 0) || (parseInt(CometId3.css("top")) > maxPersonPosY) ){
    document.getElementById('Comet3'+cometIdx3).style.display = 'none';
  }
}
function spawnComets2(){
  let xEnd2 = 0;
  let xStart2 = 0;
  let yEnd2 = 0;
  let yStart2 = 0;
  let speed2 = 10;
  let constant2 = 0;
    cometIdx2 = cometIdx2 +1;
    var stri = "<div id='Comet2"+cometIdx2+"' class='CometClass'><img src='src/covidstriod.png'/></div>";
    asteriod_sect.append(stri); 
    CometId2 = $('#Comet2'+cometIdx2);
    
    let where2 = cometIdx2 % 4;
    if(where2 <= 0){
      xEnd2 = getRandomNumber(0,maxPersonPosX);
      xStart2 = getRandomNumber(0,maxPersonPosX);
      xSpd2 = xEnd2-xStart2;
      ySpd2 = maxPersonPosY;
      speed2 = Math.sqrt(xSpd2*xSpd2 + ySpd2*ySpd2);
      constant2 = speed2/maxPersonPosY;
      xSpd2 = xSpd/constant2;
      CometId2.css("left",xStart2);
      CometId2.css("top",0);
  
    }
    else if(where2 == 1){
      xEnd2 = getRandomNumber(0,maxPersonPosX);
      xStart2 = getRandomNumber(0,maxPersonPosX);
      xSpd2 = xEnd2-xStart2;
      ySpd2 = maxPersonPosY;
      speed2 = Math.sqrt(xSpd2*xSpd2 + ySpd2*ySpd2);
      constant2 = speed2/maxPersonPosY;
      xSpd2 = xSpd2/constant2;
      CometId2.css("left",xStart2);
      CometId2.css("top",maxPersonPosY);
    }
    else if(where2 == 2){
      yEnd2 = getRandomNumber(0,maxPersonPosY);
      yStart2 = getRandomNumber(0,maxPersonPosY);
      ySpd2 = yEnd2-yStart2;
      xSpd2 = maxPersonPosX;
      speed2 = Math.sqrt(xSpd2*xSpd2 + ySpd2*ySpd2);
      constant2 = speed2/maxPersonPosX;
      ySpd2 = ySpd2/constant2;
      CometId2.css("top",yStart2);
      CometId2.css("left",0);
    }
    else {
      yEnd2 = getRandomNumber(0,maxPersonPosY);
      yStart2 = getRandomNumber(0,maxPersonPosY);
      ySpd2 = yEnd2 - yStart2;
      xSpd2 = maxPersonPosX;
      speed2 = Math.sqrt(xSpd2*xSpd2 + ySpd2*ySpd2);
      constant2 = speed2/maxPersonPosX;
      ySpd2 = ySpd2/constant2;
      CometId2.css("top",yStart2);
      CometId2.css("left",maxPersonPosX);
    }
  }

function spawnComets(){
let xEnd = 0;
let xStart = 0;
let yEnd = 0;
let yStart = 0;
let speed = 10;
let constant = 0;
  cometIdx = cometIdx +1;
  var stri = "<div id='Comet"+cometIdx+"' class='CometClass'><img src='src/covidstriod.png'/></div>";
  acutal_game.append(stri); 
  CometId = $('#Comet'+cometIdx);
  
  let where = cometIdx % 4;
  if(where <= 0){
    xEnd = getRandomNumber(0,maxPersonPosX);
    xStart = getRandomNumber(0,maxPersonPosX);
    xSpd = xEnd-xStart;
    ySpd = maxPersonPosY;
    speed = Math.sqrt(xSpd*xSpd + ySpd*ySpd);
    constant = speed/maxPersonPosY;
    xSpd = xSpd/constant;
    CometId.css("left",xStart);
    CometId.css("top",0);

  }
  else if(where == 1){
    xEnd = getRandomNumber(0,maxPersonPosX);
    xStart = getRandomNumber(0,maxPersonPosX);
    xSpd = xEnd-xStart;
    ySpd = maxPersonPosY;
    speed = Math.sqrt(xSpd*xSpd + ySpd*ySpd);
    constant = speed/maxPersonPosY;
    xSpd = xSpd/constant;
    CometId.css("left",xStart);
    CometId.css("top",maxPersonPosY);
  }
  else if(where == 2){
    yEnd = getRandomNumber(0,maxPersonPosY);
    yStart = getRandomNumber(0,maxPersonPosY);
    ySpd = yEnd-yStart;
    xSpd = maxPersonPosX;
    speed = Math.sqrt(xSpd*xSpd + ySpd*ySpd);
    constant = speed/maxPersonPosX;
    ySpd = ySpd/constant;
    CometId.css("top",yStart);
    CometId.css("left",0);
  }
  else {
    yEnd = getRandomNumber(0,maxPersonPosY);
    yStart = getRandomNumber(0,maxPersonPosY);
    ySpd = yEnd - yStart;
    xSpd = maxPersonPosX;
    speed = Math.sqrt(xSpd*xSpd + ySpd*ySpd);
    constant = speed/maxPersonPosX;
    ySpd = ySpd/constant;
    CometId.css("top",yStart);
    CometId.css("left",maxPersonPosX);
  }
}

function moveComet2(CometId2,where,xSpeed,ySpeed){
  if(cometIdx2 %4 <=0 ){
    newPosx2 = parseInt(CometId2.css("left")) + spdMultiplier*xSpeed/140;
    newPosy2 = parseInt(CometId2.css("top")) + spdMultiplier*ySpeed/140;
  }
  else if(cometIdx2 %4 == 1 ){
    newPosx2 = parseInt(CometId2.css("left")) + spdMultiplier*xSpeed/140;
    newPosy2 = parseInt(CometId2.css("top")) - spdMultiplier*ySpeed/140;
  }
  else if(cometIdx2 %4 == 2 ){
    newPosx2 = parseInt(CometId2.css("left")) + spdMultiplier*xSpeed/140;
    newPosy2 = parseInt(CometId2.css("top")) + spdMultiplier*ySpeed/140;
  }
  else if(cometIdx2 %4==3){
    newPosx2 = parseInt(CometId2.css("left")) - spdMultiplier*xSpeed/140;
    newPosy2 = parseInt(CometId2.css("top")) + spdMultiplier*ySpeed/140;
  }
  CometId2.css("top",newPosy2);
  CometId2.css("left",newPosx2);

  if( parseInt(CometId2.css("left") < 0) || (parseInt(CometId2.css("left")) > maxPersonPosX) ){
    document.getElementById('Comet2'+cometIdx2).style.display = 'none';
  }
  if(parseInt(CometId2.css("top") < 0) || (parseInt(CometId2.css("top")) > maxPersonPosY) ){
    document.getElementById('Comet2'+cometIdx2).style.display = 'none';
  }
}

function moveComet(CometId,where,xSpeed,ySpeed){
  if(cometIdx %4 <=0 ){
    newPosx = parseInt(CometId.css("left")) + spdMultiplier*xSpeed/140;
    newPosy = parseInt(CometId.css("top")) + spdMultiplier*ySpeed/140;
  }
  else if(cometIdx %4 == 1 ){
    newPosx = parseInt(CometId.css("left")) + spdMultiplier*xSpeed/140;
    newPosy = parseInt(CometId.css("top")) - spdMultiplier*ySpeed/140;
  }
  else if(cometIdx %4 == 2 ){
    newPosx = parseInt(CometId.css("left")) + spdMultiplier*xSpeed/140;
    newPosy = parseInt(CometId.css("top")) + spdMultiplier*ySpeed/140;
  }
  else if(cometIdx %4==3){
    newPosx = parseInt(CometId.css("left")) - spdMultiplier*xSpeed/140;
    newPosy = parseInt(CometId.css("top")) + spdMultiplier*ySpeed/140;
  }
  CometId.css("top",newPosy);
  CometId.css("left",newPosx);
  if( parseInt(CometId.css("left") < 0) || (parseInt(CometId.css("left")) > maxPersonPosX) ){
    document.getElementById('Comet'+cometIdx).style.display = 'none';
  }
  if(parseInt(CometId.css("top") < 0) || (parseInt(CometId.css("top")) > maxPersonPosY) ){
    document.getElementById('Comet'+cometIdx).style.display = 'none';
  }
}


function checkCollisions(){
  if(isColliding(mask,player)){
    playerMasked = 1;
    document.getElementById('mask').style.display = 'none';
    document.getElementById("player").src = "src/player/player_masked.gif";
    let beat = new Audio('src/audio/collect.mp3');
    beat.volume = volume;
    beat.play();
  }
  if(isColliding(VaccId,player)){
    document.getElementById('VaccId').style.display = 'none';
    let beat = new Audio('src/audio/collect.mp3');
    beat.volume = volume;
    beat.play();
    ++vaccLevel;
    spdMultiplier = spdMultiplier * 1.2;
    danger_num = danger_num +2;

  }
  if(isColliding(CometId,player) && playerMasked){
    document.getElementById('Comet'+cometIdx).style.display = 'none';
    document.getElementById("player").src = "src/player/player.gif";
    playerMasked =0;
  }
  if(isColliding(CometId2,player) && playerMasked){
    document.getElementById('Comet2'+cometIdx2).style.display = 'none';
    document.getElementById("player").src = "src/player/player.gif";
    playerMasked =0;
  }
  if(isColliding(CometId3,player) && playerMasked){
    document.getElementById('Comet3'+cometIdx3).style.display = 'none';
    document.getElementById("player").src = "src/player/player.gif";
    playerMasked =0;
  }
  if(isColliding(CometId,player) && !playerMasked){
    document.getElementById('Comet'+cometIdx).style.display = 'none';
    document.getElementById("player").src = "src/player/player_touched.gif";
    document.getElementById("player").position = "fixed";
    isAlive = 0;
    let beat = new Audio('src/audio/die.mp3');
    beat.volume = volume;
    beat.play();
  }
  if(isColliding(CometId2,player) && !playerMasked){
    document.getElementById('Comet2'+cometIdx2).style.display = 'none';
    document.getElementById("player").src = "src/player/player_touched.gif";
    document.getElementById("player").position = "fixed";
    isAlive = 0;
    let beat = new Audio('src/audio/die.mp3');
    beat.volume = volume;
    beat.play();
  }
  if(isColliding(CometId3,player) && !playerMasked){
    document.getElementById('Comet3'+cometIdx3).style.display = 'none';
    document.getElementById("player").src = "src/player/player_touched.gif";
    document.getElementById("player").position = "fixed";
    isAlive = 0;
    let beat = new Audio('src/audio/die.mp3');
    beat.volume = volume;
    beat.play();
  }
}
function spawnVacc(){
  //let xLoc = getRandomNumber(0,maxPersonPosX);
  //let yLoc = getRandomNumber(0,maxPersonPosY);
  document.getElementById('VaccId').style.display = 'inline-block';
  VaccId = $('#VaccId');
 // var newPosx = parseInt(mask.css("left")) + xLoc;
 // var newPosy = parseInt(mask.css("top")) + xLoc;
  VaccId.css("left",getRandomNumber(0,maxPersonPosX));
  VaccId.css("top",getRandomNumber(0,maxPersonPosY));
  setTimeout(function(){
    despawnVacc();
  },vaccineGone);
}

function despawnVacc(){
  document.getElementById('VaccId').style.display = 'none';
}
// TODO: ADD YOUR FUNCTIONS HERE
function spawnMask(){
  //let xLoc = getRandomNumber(0,maxPersonPosX);
  //let yLoc = getRandomNumber(0,maxPersonPosY);
  document.getElementById('mask').style.display = 'inline-block';
  mask = $('#mask');
 // var newPosx = parseInt(mask.css("left")) + xLoc;
 // var newPosy = parseInt(mask.css("top")) + xLoc;
  mask.css("left",getRandomNumber(0,maxPersonPosX));
  mask.css("top",getRandomNumber(0,maxPersonPosY));
  setTimeout(function(){
    despawnMask();
  },maskGone);
  
}

function despawnMask(){
  document.getElementById('mask').style.display = 'none';
}

function moveLeft(){
  if(!isDiag){
    var newPos = parseInt(player.css("left")) - PERSON_SPEED;
  }
  else{
    var newPos = parseInt(player.css("left")) - 9;
  }
  if(newPos < 0){
    newPos = 0;
  }
  if(playerMasked){
    document.getElementById("player").src = "src/player/player_masked_left.gif";
  }
  else {document.getElementById("player").src = "src/player/player_left.gif";}
  player.css("left", newPos);
}
function moveRight(){
  if(!isDiag){
    var newPos = parseInt(player.css("left")) + PERSON_SPEED;
  }
  else{
    var newPos = parseInt(player.css("left")) + 9;
  }
  if(newPos > maxPersonPosX){
    newPos = maxPersonPosX;
  }
  if(playerMasked){
    document.getElementById("player").src = "src/player/player_masked_right.gif";
  }
  else {document.getElementById("player").src = "src/player/player_right.gif";}
  player.css("left", newPos);
}
function moveUp(){
  if(!isDiag){
    var newPos = parseInt(player.css("top")) - PERSON_SPEED;
  }
  else{
    var newPos = parseInt(player.css("top")) - 9;
  }
  if(newPos < 0){
    newPos = 0;
  }
  if(playerMasked){
    document.getElementById("player").src = "src/player/player_masked_up.gif";
  }
  else {document.getElementById("player").src = "src/player/player_up.gif";}
  player.css("top", newPos);
}
function moveDown(){
  if(!isDiag){
    var newPos = parseInt(player.css("top")) + PERSON_SPEED;
  }
  else{
    var newPos = parseInt(player.css("top")) + 9;
  }
  if(newPos > maxPersonPosY){
    newPos = maxPersonPosY;
  }
  if(playerMasked){
    document.getElementById("player").src = "src/player/player_masked_down.gif";
  }
  else{
    document.getElementById("player").src = "src/player/player_down.gif";
  }
  player.css("top", newPos);
}
// Keydown event handler
document.onkeydown = function(e) {
  if (e.key == 'ArrowLeft') LEFT = true;
  if (e.key == 'ArrowRight') RIGHT = true;
  if (e.key == 'ArrowUp') UP = true;
  if (e.key == 'ArrowDown') DOWN = true;
}

function checkMovement(){
  var movementState = 0; // 1:left 2:right 3:up 4:down 5:left+up 6:right+up 7:left+down 8:down+right
  if(DOWN & LEFT & UP & !DOWN){movementState = 1;isDiag = 0;}
  else if(UP & DOWN & RIGHT & !LEFT){movementState = 2; isDiag = 0;}
  else if(LEFT & RIGHT & UP & !DOWN){movementState = 3;isDiag = 0;}
  else if(LEFT & RIGHT & DOWN & !UP) {movementState = 4;isDiag = 0;}
  else if(LEFT & UP & !DOWN & !RIGHT){movementState = 5;isDiag = 1;}
  else if(!LEFT & UP & !DOWN & RIGHT){movementState = 6;isDiag = 1;}
  else if(LEFT & !UP & DOWN & !RIGHT){movementState = 7;isDiag = 1;}
  else if(!LEFT & !UP & DOWN & RIGHT){movementState = 8;isDiag = 1;}
  else if(!LEFT & !UP & DOWN & !RIGHT){movementState = 4;isDiag = 0;}
  else if(!LEFT & UP & !DOWN & !RIGHT){movementState = 3;isDiag = 0;}
  else if(!LEFT & !UP & !DOWN & RIGHT){movementState = 2;isDiag = 0;}
  else if(LEFT & !UP & !DOWN & !RIGHT){movementState = 1;isDiag = 0;}
  switch(movementState){
    case 1:
      moveLeft();
      break;
    case 2:
      moveRight();
      break;
    case 3:
      moveUp()
      break;
    case 4:
      moveDown();
      break;
    case 5:
      moveLeft();
      moveUp();
      break;
    case 6:
      moveRight();
      moveUp();
      break;
    case 7:
      moveLeft();
      moveDown();
      break;
    case 8:
      moveRight();
      moveDown();
      break;
    default:
      break;
  }
}
// Keyup event handler
document.onkeyup = function (e) {
    if (e.key == 'ArrowLeft') LEFT = false;
    if (e.key == 'ArrowRight') RIGHT = false;
    if (e.key == 'ArrowUp') UP = false;
    if (e.key == 'ArrowDown') DOWN = false;
}


//===================================================

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange){
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange){
  const o1D = { 'left': o1.offset().left + o1_xChange,
        'right': o1.offset().left + o1.width() + o1_xChange,
        'top': o1.offset().top + o1_yChange,
        'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = { 'left': o2.offset().left,
        'right': o2.offset().left + o2.width(),
        'top': o2.offset().top,
        'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
     // collision detected!
     return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max){
  return (Math.random() * (max - min)) + min;
}
