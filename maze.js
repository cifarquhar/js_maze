const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// INITIALISATION

// Game state
let completed = false;
let currentLevel = 1;

// Player coordinates
let playerX = 15;
let playerY = 15;

// Walls

const walls = [
  [
    {
      xStart: 50,
      yStart: 50,
      xEnd: 100,
      yEnd: 55
    },
    {
      xStart: 100,
      yStart: 100,
      xEnd: 105,
      yEnd: 200
    },
    {
      xStart: 100,
      yStart: 200,
      xEnd: 200,
      yEnd: 205
    }
  ],
  [
    {
      xStart: 75,
      yStart: 200,
      xEnd: 80,
      yEnd: 250
    },
    {
      xStart: 250,
      yStart: 40,
      xEnd: 350,
      yEnd: 45
    },
    {
      xStart: 300,
      yStart: 300,
      xEnd: 350,
      yEnd: 305
    }
  ]
];

// INPUT HANDLING

function updatePlayerPosition(event){
  const keyPressed = event.keyCode;
  
  if (keyPressed === 37 && playerX > 10){     // Left
    const tempX = playerX - 10;
    if (checkCollisionDetection(tempX, playerY)){
      playerX = tempX;
    }
  }

  if (keyPressed === 38 && playerY > 10){     // Up
    const tempY = playerY - 10;
    if (checkCollisionDetection(playerX, tempY)) {
      playerY = tempY;
    }
  }

  if (keyPressed === 39 && playerX < canvas.width - 10){     // Right
    const tempX = playerX + 10;
    if (checkCollisionDetection(tempX, playerY)) {
      playerX = tempX;
    }
  }

  if (keyPressed === 40 && playerY < canvas.height - 10){     // Down
    const tempY = playerY + 10;
    if (checkCollisionDetection(playerX, tempY)) {
      playerY = tempY;
    }
  }
}

function checkCollisionDetection(xCoord, yCoord){
  return walls[currentLevel - 1].every((wall) => {
    return (xCoord < wall.xStart || xCoord > wall.xEnd) || (yCoord < wall.yStart || yCoord > wall.yEnd)
  })
}

function checkWin(){
  if (playerX > canvas.width - 20 && playerY > canvas.height - 20){
    if (currentLevel === walls.length){
      alert("Congratulations, you escaped!");
      completed = true;
    }
    else{
      alert("You made it, now on to the next level!");
    }
    resetPlayer();
  };
}

function resetPlayer(){
  playerX = 15;
  playerY = 15;
  currentLevel += 1;
}


// RENDERING

// Player
function drawPlayer(){
  ctx.beginPath();
  ctx.arc(playerX, playerY, 5, 0, Math.PI * 2, false);
  ctx.fillStyle = "#114C84";
  ctx.fill();
  ctx.closePath();
}

// Walls
function drawWalls(){
  walls[currentLevel - 1].forEach((wall) => {
    ctx.beginPath();
    ctx.fillStyle = "#2D0E00";
    ctx.fillRect(wall.xStart, wall.yStart, wall.xEnd - wall.xStart, wall.yEnd - wall.yStart);
    ctx.closePath();
  });
}

// Rendering turn
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  if (!completed){
    drawWalls();
    checkWin();
    requestAnimationFrame(draw);
  }
}



// RUN GAME

document.addEventListener("keydown", updatePlayerPosition)

draw();