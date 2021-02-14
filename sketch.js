var path,mainCyclist;
var pathImg,mainRacerImg1,mainRacerImg2;

var END =0;
var PLAY =1;
var gameState = PLAY;

var distance=0;

var cycleBell, pinkCG, yellowCG, redCG, obstaclesG;

var player1, player2, player3;
var player1Img, player2Img, player3Img;

var select_oppPlayer;

var gameOverImg, gameOver;

var obstacleG, obstacle, obstacle1, obstacle2, obstacle3;

var rVelocity, rObstacle;

var hurdles, hurdleG;

function preload(){
  //loading images for the different sprites 
  
  pathImg = loadImage("images/Road.png");
  
  mainRacerImg1 = loadAnimation("images/mainPlayer1.png","images/mainPlayer2.png");
  mainRacerImg2= loadAnimation("images/mainPlayer3.png");
  
  player1Img = loadAnimation("images/opponent1.png","images/opponent2.png");
  player2Img = loadAnimation("images/opponent4.png","images/opponent5.png");
  player3Img = loadAnimation("images/opponent7.png","images/opponent8.png");
  
  gameOverImg = loadAnimation("images/gameOver.png");
  
  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  
  //loading sound for cycle bell
  cycleBell = loadSound("sound/bell.mp3");
}

function setup(){
  
  createCanvas(500,300);

  // Moving background
  path=createSprite(100,150);
  path.addImage(pathImg);

  //creating boy running
  mainCyclist  = createSprite(70,150,20,20);
  mainCyclist.addAnimation("Cyclist",mainRacerImg1);
  mainCyclist.scale=0.07;
  mainCyclist.setCollider("rectangle" , 0, 0, 1000, 1450);
  
  //creting gameOver sprite
  gameOver = createSprite(250,150,20,20);
  gameOver.addAnimation("gameover", gameOverImg);
  gameOver.scale = 0.7;
  
  //creating groups for the cyclists and obstacle
  pinkCG = new Group();
  yellowCG = new Group();
  redCG = new Group();
  obstacleG = new Group();
  hurdleG = new Group();

}

function draw() {
  background(0);
  
  //determining conditions if gameState is play
  if(gameState===PLAY){
    
    //gradually increasing the path's velocity
    path.velocityX = - (6 + 2*distance/100)
    
    //making the gameOver sprite invisible
    gameOver.visible = false;
    
    //moving cyclist with mouse's y direction
    mainCyclist.y = World.mouseY;

    //creating edges and collidin the cyclist with edges
    edges= createEdgeSprites();
    mainCyclist .collide(edges);

    //code to reset the background
    if(path.x < 0 ){
      path.x = width/2;
    }
      
    //calculating score
    distance = distance + Math.round(getFrameRate()/50);
  
    //playing the cycle bell sound when space is pressed
    if(keyDown("space")) {
    cycleBell.play();
   }
    
    //selecting different opponents randomly in each 150 frames
    select_oppPlayer = Math.round(random(1,3)) 
    if(frameCount%150 === 0) {
      if(select_oppPlayer === 1) {
        pinkCyclists();
      } 
      else if(select_oppPlayer === 2) {
        yellowCyclists();
      } 
      else if(select_oppPlayer === 3) {
        redCyclists();
      }
   }
    
    //creating obstacles in each 200 frames
    if (frameCount%200 === 0) {
      obstacles();
    }

    if (frameCount%250 === 0) {
      hurdle();
    }
    
    //going the gameState end if main cyclist touches any opponent or obstacle
    if (pinkCG.isTouching(mainCyclist) || yellowCG.isTouching(mainCyclist) || redCG.isTouching(mainCyclist) || obstacleG.isTouching(mainCyclist) || hurdleG.isTouching(mainCyclist)) {
      gameState = END;
    }
    
 }
  if(gameState === END) {
    //setting path velocity to 0
    path.velocityX = 0;
    
    //setting main cyclist velocity to 0
    mainCyclist.velocityY = 0;
    
    //destroying the cyclists and obstacles, setting velocity to 0 and lifetime to -1
    pinkCG.destroyEach();
    pinkCG.setVelocityXEach(0);
    pinkCG.setLifetimeEach(-1);
    
    yellowCG.destroyEach();
    yellowCG.setVelocityXEach(0);
    yellowCG.setLifetimeEach(-1);
    
    redCG.destroyEach();
    redCG.setVelocityXEach(0);
    redCG.setLifetimeEach(-1);
    
    obstacleG.destroyEach();
    obstacleG.setVelocityXEach(0);
    obstacleG.setLifetimeEach(-1);
    
    //making the gameOver sprite visible
    gameOver.visible = true;
    
    //calling in reset function when up arrow pressed
    if(keyDown("UP_ARROW")) {
      reset();
    }
  }
  
  drawSprites();
  
  //displaying distance
  textSize(20);
  fill(255);
  text("Distance: "+ distance,350,30);
  
  //displaying reset text
  if(gameOver.visible === true) {
    textSize(15);
    fill(225);
    text("Press Up arrow to restart the game!",130,200);
  }
}

function reset() {
  //going back to gameState to play
  gameState = PLAY;
  
  //setting distance back to 0
  distance = 0;
}

function obstacles() {
  //giving y position randomly
  obstacle = createSprite(0,Math.round(random(50,250)),10,10);

  obstacle.setCollider("rectangle",0,0,obstacle.width,obstacle.height);
  
  //giving velocity randomly
  rVelocity = Math.round(random(3,6))
  
  //giving scale
  obstacle.scale = 0.05;
  
  //giving lifetime to avoid memory leak
  obstacle.lifetime = 90;
  
  //gradually increasing velocity
  obstacle.velocityX = rVelocity + distance/100;
  
  //displaying different obstacles randomly
  rObstacle = Math.round(random(1,3))
  switch(rObstacle) {
    case 1 : obstacle.addImage(obstacle1);
             break;
    case 2 : obstacle.addImage(obstacle2);
             break;
    case 3 : obstacle.addImage(obstacle3);
             break;
    default: break;
  }
  //adding variable to group
  obstacleG.add(obstacle);
}

function pinkCyclists() {
  //giving y position randomly
  player1 = createSprite(0, Math.round(random(50,250)),10,10);
  
  player1.setCollider("circle",0,0,10);
  
  //giving scale
  player1.scale = 0.06;
  
  //adding animation
  player1.addAnimation("PinkCyclist", player1Img);
  
  //gradually increasing velocity
  player1.velocityX = 6 + 2*distance/100;
  
  //giving lifetime to avoid memory leak
  player1.lifteime = 170;
  
  //adding variable to group
  pinkCG.add(player1);
}

function yellowCyclists() {
  //giving y position randomly
  player2 = createSprite(0, Math.round(random(50,250)),10,10);
  
  player2.setCollider("circle",0,0,10);
  
  //giving scale
  player2.scale = 0.06;
  
  //adding animation
  player2.addAnimation("YellowCyclist", player2Img);
  
  //gradually increasing velocity
  player2.velocityX = 6 + 2*distance/100;
  
  //giving lifetime to avoid memory leak
  player2.lifteime = 170;
  
  //adding variable to group
  yellowCG.add(player2);
}

function redCyclists() {
  //giving y position randomly
  player3 = createSprite(0, Math.round(random(50,250)),10,10);
  
  player3.setCollider("circle",0,0,10);
  
  //giving scale
  player3.scale = 0.06;
  
  //adding animation
  player3.addAnimation("RedCyclist", player3Img);
  
  //gradually increasing velocity
  player3.velocityX = 6 + 2*distance/100;
  
  //giving lifetime to avoid memory leak
  player3.lifteime = 170;
  
  //adding variable to group
  redCG.add(player3);
}

function hurdle() {
  hurdles = createSprite(0,Math.round(random(50,250)),10,40);
  hurdles.shapeColour = "white";
  hurdles.velocityX = 6 + 2*distance/100;
  hurdles.lifetime = 170;
  hurdleG.add(hurdles);
}