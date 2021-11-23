var plane;
var bg,bg_img;
var bgs;
var plane_img;
var Asteroids,a1,a2;
var gameState = "START"
var startButton,start_img;
var click;
var b1,b2,bimg;
var bulletGrp, asteroidGrp;
var life = 3
var bulletCount = 30  ;
var invLine;
var score = 0;
var ammo, ammo_img;

var fnl,fnl_img
var track2;
var reload
var h1,h2,h3;
var h1_img,h2_img,h3_img;

var reset , reset_img;
var lose , lose_img,win,win_img;
var crash;
var gunSpash;



function preload()
{
bg_img = loadImage("bg2.JPG")
fnl_img = loadImage("fnl.JPG")
plane_img = loadImage("plane.png")
air = loadImage("track.png")
a1 = loadImage("a1.png")

start_img = loadImage("start.png")
click = loadSound("click.wav")
bgs = loadSound("bgs.mp3")
bimg = loadImage("buletn.png")
ammo_img = loadImage("ammo.png")
reset_img = loadImage("reset.png")
h1_img = loadImage("h1.png")
lose_img = loadImage("lose.png")
crash = loadSound("crash.wav")
gunSpash = loadSound("gun.wav")
win_img = loadImage("win.png")


}

function setup() {
  createCanvas(windowWidth,windowHeight);
 

  invLine = createSprite(width/2,height/2,width,10)
  invLine.visible = false
    
  track2 = createSprite(width/2,height,width,height*10)
   track2.addImage(air)
  track2.scale = 2.6
  
  fnl = createSprite(width/2,track2.y - 3020,width,50)
  fnl.addImage(fnl_img)
  fnl.scale = 1.16
  fnl.visible = false
  fnl.debug = true
  fnl.setCollider("rectangle",0,-150,1000,100)


  h1 = createSprite(50,plane.y - 100,34,43) 
  h1.addImage(h1_img)
  h1.scale = 0.3

  h2 = createSprite(100,plane.y - 100,34,43)
  h2.addImage(h1_img)
  h2.scale = 0.3

  h3 = createSprite(150,plane.y - 100,34,43)
  h3.addImage(h1_img)
  h3.scale = 0.3
   
  lose = createSprite(width/2,plane.y - 500,100,100)
  lose.addImage(lose_img)
  lose.visible = false

  win = createSprite(width/2,plane.y - 100,100,100)
  win.addImage(win_img)
  win.visible = false

  plane = createSprite(width/2,height/2+100,50,50);
  plane.addImage(plane_img)
  plane.scale = 0.35
     
  reset = createSprite(width-300,10,50,50)
 reset.addImage(reset_img)
 reset.scale = 0.75
 reset.debug = false
 
  bulletGrp = new Group()
  asteroidGrp = new Group()
  ammo_grp = new Group()


  bgs.play()
  bgs.setVolume(0.3)
 
}

function draw() {
  background(bg_img)
  console.log(gameState)
 
  //image(air, 0, -height * 5, width, height * 10);
   
   invLine.y = plane.y+50
  h1.y = plane.y - 600
  h2.y = plane.y - 600
  h3.y = plane.y - 600
  reset.y = plane.y - 600
  lose.y = plane.y - 400
  win.y = plane.y - 400
 

  if(gameState === "START")
  {
    startButton = createSprite(500,height-50,20,20)
    startButton.addImage(start_img)
    startButton.scale = 1.5
   if(keyIsDown(DOWN_ARROW))
   {
     gameState = "SHOOT"
     click.play()
   
   }

   if(keyIsDown(UP_ARROW))
   {
     reload()
   }
  }
  if(gameState === "SHOOT")
 {
  score += 1
  handleBulletASTcollision()
 
 plane.velocityY = -2
 
 if(keyIsDown(UP_ARROW))
 {
   reload()
 }
 

  if(plane.isTouching(fnl))
  {
  gameState = "ENDwIN"
   

  }
  
  if(life === 2)
  {
   h3.visible = false

  }
 
  if(life === 1)
  {
    h3.visible = false
    h2.visible = false
  }
  if(life === 0 || bulletCount === 0)
  {
   gameState = "ENDlOSE" 
   h3.visible = false
    h2.visible = false
    h1.visible = false
  }

    camera.position.y = plane.position.y - 300

  /*if(keyIsDown(UP_ARROW))
  {
   plane.y -= 5
         
  }*/
 
 if(keyWentUp(32)&& bulletCount > 0)
 {
  bangbullet()
  gunSpash.play()

 } 
  if(keyIsDown(RIGHT_ARROW))
  {
   plane.x += 20
  }

  if(keyIsDown(LEFT_ARROW))
  {
   plane.x -= 20
  }
  handlePlaneASTcollision()
  spawnRocks()
  handleLineASTcollision()  
  spawnAmmo()
  handleAmmo()
 }
 drawSprites();
 textFont("impact")
 textSize(20)
 fill("PURPLE")
 text("Lives :" + life,plane.x,plane.y + 70)
 
 textFont("impact")
 textSize(40)
 fill("PURPLE")
 text("SCORE :" + score, 1200,plane.y - 300)

 textFont("impact")
 textSize(20)
 fill("PURPLE")
 text("bC :" + bulletCount,plane.x - 60,plane.y + 70)

 if(gameState === "ENDlOSE")
 {
  plane.velocityY = 0
  asteroidGrp.destroyEach()
  ammo_grp.destroyEach()
  bulletGrp.destroyEach()
  endlose()
  if(keyIsDown(UP_ARROW))
  {
    reload()
  } 
  
 }

 if(gameState === "ENDwIN")
 {
  plane.velocityY = 0
  asteroidGrp.destroyEach()
  ammo_grp.destroyEach()
  bulletGrp.destroyEach()
  if(keyIsDown(UP_ARROW))
  {
    reload()
  }
 win.visible = true
  
 }
}

//----------------------------------------------------------------------------------------------------------------------//
function spawnRocks()
{
  if(frameCount % 60 === 0)
 { 
  Asteroids = createSprite(random(width*0.25,width*0.75),plane.y-650,20,20)
  
  Asteroids.velocityY = score/50
  Asteroids.addImage(a1)
  Asteroids.scale = 0.45
  asteroidGrp.add(Asteroids)
  Asteroids.lifetime = 130
 }
}


function spawnAmmo()
{
 if(frameCount % 300 === 0)
 {
  ammo= createSprite(random(width*0.25,width*0.75),plane.y - 650,20,20)
  ammo.velocityY = 4
  ammo.addImage(ammo_img)
  ammo_grp.add(ammo)
 ammo.scale = 0.15
 ammo.lifetime = 130
 }

}

function bangbullet()
{
bulletCount -=1
  b1 = createSprite(plane.x-50,plane.y,10,10) 
 b2 = createSprite(plane.x+50,plane.y,10,10)
b1.velocityY = -30
b2.velocityY = -30
b1.addImage(bimg)
b2.addImage(bimg) 
b1.scale = 0.05
b2.scale = 0.05
 bulletGrp.add(b1)
 bulletGrp.add(b2)
b1.lifetime = 130
b2.lifetime = 130
}

//---------------------------------------------------------------------------------------------------------------------------------------------//
function handleBulletASTcollision()
{
 for(i = 0;i < bulletGrp.length;i++)
 {
  for(x = 0;x < asteroidGrp.length;x++)
  {
   if(bulletGrp[i].isTouching(asteroidGrp[x])||asteroidGrp[x].isTouching(bulletGrp[i]))
   {
     asteroidGrp[x].destroy()
     bulletGrp.destroyEach()
    crash.play()
   }
  }
 }
}
function handlePlaneASTcollision()
{
  
 
 
  for(x = 0;x < asteroidGrp.length;x++)
  {
   if(plane.isTouching(asteroidGrp[x])||asteroidGrp[x].isTouching(plane))
   {
     asteroidGrp[x].destroy()
     life -= 1
     score -= 100
    crash.play()
   }
  }
 

}

function handleLineASTcollision()
{
  
 
 
  for(x = 0;x < asteroidGrp.length;x++)
  {
   if(invLine.isTouching(asteroidGrp[x])||asteroidGrp[x].isTouching(invLine))
   {
     asteroidGrp[x].destroy()
     life -= 1
     score -= 100
     
    }
  }
 

}

function handleAmmo()
{
 for(i = 0;i < ammo_grp.length;i++)
 {
  plane.overlap(ammo_grp[i], function (collector,collected){
   bulletCount = 50
   collected.remove()
  })
 }

}

//-------------------------------------------------------------------------------------------------------------------------------------------------//

function endlose()
{

lose.visible = true

}


function reload()
{
  window.location.reload();
    life = 3 
    h1.visible = true
    h2.visible = true
    h3.visible = true
}
