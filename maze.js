const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// INITIALISATION

// Player coordinates
let playerX = 15;
let playerY = 15;

// Walls
const wallPoints = [
  {
    xStart: 50,
    yStart: 50,
    xEnd:100,
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
]


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
  return wallPoints.every((wall) => {
    return (xCoord < wall.xStart || xCoord > wall.xEnd) || (yCoord < wall.yStart || yCoord > wall.yEnd)
  })
}

function checkWin(){
  if (playerX > canvas.width - 20 && playerY > canvas.height - 20){
    alert("Congratulations, you escaped!");
    resetPlayer();
  };
}

function resetPlayer(){
  playerX = 15;
  playerY = 15;
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
  wallPoints.forEach((wall) => {
    ctx.beginPath();
    ctx.strokeStyle = "#2D0E00";
    ctx.fillStyle = "#2D0E00";
    ctx.fillRect(wall.xStart, wall.yStart, wall.xEnd - wall.xStart, wall.yEnd - wall.yStart);
    ctx.strokeRect(wall.xStart, wall.yStart, wall.xEnd - wall.xStart, wall.yEnd - wall.yStart);
    ctx.closePath();
  });
}

// Rendering turn
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawWalls();
  checkWin();
  requestAnimationFrame(draw);
}



// RUN GAME

document.addEventListener("keydown", updatePlayerPosition)

draw();