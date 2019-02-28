const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const timerDisplay = document.querySelector("#timer");
const scoreDisplay = document.querySelector("#score");
const levelDisplay = document.querySelector("#level");

// INITIALISATION

// Game state
let completed = false;
let currentLevel = 1;
const maxLevel = 5;
let timeRemaining = 10000;
let currentScore = 0;

// Player coordinates
let playerX = 15;
let playerY = 5;

// Walls

function getOuterWalls(){
  return [
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
}

let levelWalls = generateMaze(10, 470, 10, 470, "H", null, null, getOuterWalls());

function getRandomInt(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min) * 10;
}

function generateMaze(minX, maxX, minY, maxY, direction, prevGap, side, existingWalls){

  let gapStart;

  wallsToRender = existingWalls;

  if (direction === "H"){
    const yCoord = getRandomInt((minY + 10) / 10, (maxY - 20) /10)

    if (yCoord !== prevGap) {
      gapStart = getRandomInt(minX / 10, (maxX - 10) / 10);
    }
    else if (side === "left") {
      gapStart = maxX - 10;
    }
    else if (side === "right") {
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
      generateMaze(minX + 10, maxX - 10, minY, yCoord, "V", gapStart, "top", wallsToRender)
    }
    if (maxY - yCoord > 20 && maxX - minX > 20) {
      generateMaze(minX + 10, maxX - 10, yCoord + 10, maxY, "V", gapStart, "bottom", wallsToRender)
    }
  }
  else if (direction === "V"){
    const xCoord = getRandomInt((minX + 10) / 10, (maxX - 20) / 10)
    
    if (xCoord !== prevGap){
      gapStart = getRandomInt(minY / 10, (maxY - 10) / 10);
    }
    else if (side === "top"){
      gapStart = maxY - 10;
    }
    else if (side === "bottom"){
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
      generateMaze(minX, xCoord, minY + 10, maxY - 10, "H", gapStart, "left", wallsToRender)
    }
    if (maxX - xCoord > 20 && maxY - minY > 20) {
      generateMaze(xCoord + 10, maxX, minY + 10, maxY - 10, "H", gapStart, "right", wallsToRender)
    }
  }

  return wallsToRender;
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
  return levelWalls.every((wall) => {
    return (xCoord < wall.xStart || xCoord > wall.xEnd) || (yCoord < wall.yStart || yCoord > wall.yEnd)
  })
}


// GAME STATE CHANGES

function checkWin(){
  if (playerX === canvas.width - 15 && playerY === canvas.height - 5){
    if (currentLevel === maxLevel){
      currentScore += timeRemaining;
      scoreDisplay.innerText = `Score: ${currentScore}`;
      // alert(`Congratulations, you escaped with a score of ${currentScore}!`);
      completed = true;
    }
    else{
      currentScore += timeRemaining;
      scoreDisplay.innerText = `Score: ${currentScore}`;
      alert("You made it, now on to the next level!");
      currentLevel += 1;
      levelDisplay.innerText = `Level: ${currentLevel}`;
    }
    resetPlayer();
  };
}

function resetPlayer(){
  playerX = 15;
  playerY = 15;
  timeRemaining = 10000 - ((currentLevel - 1) * 1000);
  levelWalls = generateMaze(10, 470, 10, 470, "H", null, null, getOuterWalls());
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
function drawWalls(walls){
  walls.forEach((wall) => {
    ctx.beginPath();
    ctx.fillStyle = "#2D0E00";
    ctx.fillRect(wall.xStart, wall.yStart, wall.xEnd - wall.xStart, wall.yEnd - wall.yStart);
    ctx.closePath();
  });
}

// Rendering turn
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!completed){
    drawPlayer();
    drawWalls(levelWalls);
    checkWin();
    updateTimer();
    if (timeRemaining <= 0){
      alert(`Out of time, you're trapped forever! \n You scored ${currentScore}`);
      completed = true;
    }
    requestAnimationFrame(draw);
  }
  else {
    ctx.fillText(`Congratulations! You escaped with a score of ${currentScore}!`, 20, 50);
  }
}



// RUN GAME

document.addEventListener("keydown", updatePlayerPosition)
draw();