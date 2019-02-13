const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// INITIALISATION

// Player coordinates
let playerX = 20;
let playerY = 20;


// INPUT HANDLING

function updatePlayerPosition(event){
  const keyPressed = event.keyCode;
  
  if (keyPressed === 37){     // Left
    playerX -= 10;
  }

  if (keyPressed === 38){     // Up
    playerY -= 10;
  }

  if (keyPressed === 39){     // Right
    playerX += 10;
  }

  if (keyPressed === 40){     // Down
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

// Rendering turn
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  requestAnimationFrame(draw);
}



// RUN GAME

document.addEventListener("keydown", updatePlayerPosition)

draw();