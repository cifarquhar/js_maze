const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// INITIALISATION

// Player coordinates
let playerX = 20;
let playerY = 20;

// Walls
const wallPoints = [
  {
    xCoord: 50,
    yCoord: 50,
    direction: "H"
  },
  {
    xCoord: 100,
    yCoord: 100,
    direction: "V"
  }
]


// INPUT HANDLING

function updatePlayerPosition(event){
  const keyPressed = event.keyCode;
  
  if (keyPressed === 37 && playerX > 10){     // Left
    playerX -= 10;
  }

  if (keyPressed === 38 && playerY > 10){     // Up
    playerY -= 10;
  }

  if (keyPressed === 39 && playerX < canvas.width - 10){     // Right
    playerX += 10;
  }

  if (keyPressed === 40 && playerY < canvas.height - 10){     // Down
    playerY += 10;
  }

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
    ctx.moveTo(wall.xCoord, wall.yCoord);
    if (wall.direction === "H"){
      ctx.lineTo(wall.xCoord + 20, wall.yCoord);
    }
    else if (wall.direction === "V"){
      ctx.lineTo(wall.xCoord, wall.yCoord + 20);
    }
    ctx.strokeStyle = "#2D0E00";
    ctx.stroke();
  });
}

// Rendering turn
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawWalls();
  requestAnimationFrame(draw);
}



// RUN GAME

document.addEventListener("keydown", updatePlayerPosition)

draw();