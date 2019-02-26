const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const timerDisplay = document.querySelector("#timer");

// INITIALISATION

// Game state
let completed = false;
let currentLevel = 1;
let timeRemaining = 10000;
let currentScore = 0;

// Player coordinates
let playerX = 15;
let playerY = 5;

// Walls
const outerWalls = [
  {
    xStart: 0,
    yStart: 0,
    xEnd: 10,
    yEnd: canvas.height
  },
  {
    xStart: 0,
    yStart: canvas.height - 10,
    xEnd: canvas.width - 20,
    yEnd: canvas.height
  },
  {
    xStart: 20,
    yStart: 0,
    xEnd: canvas.width,
    yEnd: 10
  },
  {
    xStart: canvas.width - 10,
    yStart: 0,
    xEnd: canvas.width,
    yEnd: canvas.height
  }
]

let wallsToRender = outerWalls; 

function getRandomInt(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min) * 10;
}

function generateMaze(minX, maxX, minY, maxY, direction, prevGap, side){
  let gapStart;

  if (direction === "H"){
    const yCoord = getRandomInt((minY + 10) / 10, (maxY - 20) /10)

    if (yCoord !== prevGap) {
      gapStart = getRandomInt(minX / 10, (maxX - 10) / 10);
    }
    else if (side === "left") {
      console.log("forcing shift left");
      gapStart = maxX - 10;
    }
    else if (side === "right") {
      console.log("forcing shift right");
      gapStart = minX
    }

    wallsToRender.push({
      xStart: minX,
      yStart: yCoord,
      xEnd: gapStart,
      yEnd: yCoord + 10
    })

    wallsToRender.push({
      xStart: gapStart + 10,
      yStart: yCoord,
      xEnd: maxX,
      yEnd: yCoord + 10
    })   

    if (yCoord - minY > 20 && maxX - minX > 20) {
      generateMaze(minX + 10, maxX - 10, minY, yCoord, "V", gapStart, "top")
    }
    if (maxY - yCoord > 20 && maxX - minX > 20) {
      generateMaze(minX + 10, maxX - 10, yCoord + 10, maxY, "V", gapStart, "bottom")
    }
  }
  else if (direction === "V"){
    const xCoord = getRandomInt((minX + 10) / 10, (maxX - 20) / 10)
    
    if (xCoord !== prevGap){
      gapStart = getRandomInt(minY / 10, (maxY - 10) / 10);
    }
    else if (side === "top"){
      console.log("forcing shift up");
      gapStart = maxY - 10;
    }
    else if (side === "bottom"){
      console.log("forcing shift down");
      gapStart = minY
    }

    wallsToRender.push({
      xStart: xCoord,
      yStart: minY,
      xEnd: xCoord + 10,
      yEnd: gapStart
    })

    wallsToRender.push({
      xStart: xCoord,
      yStart: gapStart + 10,
      xEnd: xCoord + 10,
      yEnd: maxY
    })   

    if (xCoord - minX > 20 && maxY - minY > 20) {
      generateMaze(minX, xCoord, minY + 10, maxY - 10, "H", gapStart, "left")
    }
    if (maxX - xCoord > 20 && maxY - minY > 20) {
      generateMaze(xCoord + 10, maxX, minY + 10, maxY - 10, "H", gapStart, "right")
    }
  }
}




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
  return wallsToRender.every((wall) => {
    return (xCoord < wall.xStart || xCoord > wall.xEnd) || (yCoord < wall.yStart || yCoord > wall.yEnd)
  })
}


// GAME STATE CHANGES

function checkWin(){
  if (playerX === canvas.width - 15 && playerY === canvas.height - 5){
    if (currentLevel === walls.length){
      currentScore += timeRemaining;
      alert(`Congratulations, you escaped with a score of ${currentScore}!`);
      completed = true;
    }
    else{
      currentScore += timeRemaining;
      alert("You made it, now on to the next level!");
    }
    resetPlayer();
  };
}

function resetPlayer(){
  playerX = 15;
  playerY = 15;
  currentLevel += 1;
  timeRemaining = 10000;
}

function updateTimer(){
  timeRemaining -= 1;
  timerDisplay.innerText = timeRemaining;
}


// RENDERING

// Player
function drawPlayer(){
  ctx.beginPath();
  ctx.arc(playerX, playerY, 5, 0, Math.PI * 2, false);
  ctx.fillStyle = "#dd0000";
  ctx.fill();
  ctx.closePath();
}

// Walls
function drawWalls(){
  wallsToRender.forEach((wall) => {
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
    updateTimer();
    if (timeRemaining <= 0){
      alert(`Out of time, you're trapped forever! \n You scored ${currentScore}`);
      completed = true;
    }
    requestAnimationFrame(draw);
  }
}



// RUN GAME

document.addEventListener("keydown", updatePlayerPosition)
generateMaze(10, 470, 10, 470, "H", null);
draw();