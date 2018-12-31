let grid = [];
let clicks = 0;
let snd;
let audio = true;

function audioSetup() {
  snd = new Audio("sizzle.wav");
  let volumeButton = document.getElementById('vol');

  if (localStorage.getItem('volume') !== null) {
    audio = localStorage.getItem('volume') == 'true';
    if (audio) {
      volumeButton.src = 'volume-high.svg'
    } else {
      volumeButton.src = 'volume-no.svg'
    }
  }
  volumeButton.addEventListener('click', () => {
    if (audio) {
      volumeButton.src = 'volume-no.svg'
      audio = false;
    } else {
      volumeButton.src = 'volume-high.svg'
      audio = true;
    }
    localStorage.setItem('volume', audio);
  });
}

function randomGrid() {
  for (let i = 0; i < 5; i++) {
    let row = [];
    for (let j = 0; j < 5; j++) {
      row.push(0);
    }
    grid.push(row);
  }

  return grid;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function generateGrid(grid) {
  let board = document.getElementById('board');
  board.innerHTML = '';
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let button = `<button class="fj" id="flapjack-${i}-${j}"`
                 + `onClick="handleClick(${i}, ${j}, ${false})">`
                 + `${grid[i][j] === 0 ? '<div class="butter"></div>' : ''}`;
                 + `</button>`;
      button = htmlToElement(button);
      board.appendChild(button);
    }
  }

  for (let k = 0; k < 30; k++) {
    handleClick(getRandomInt(4), getRandomInt(4), true);
  }
}

function handleClick(x, y, init) {
  let g = grid;

  g[x][y] = flip(g[x][y]);
  document.getElementById(`flapjack-${x}-${y}`).innerHTML =
      `${grid[x][y] === 0 ? '<div class="butter"></div>' : ''}`;

  if (x < g[0].length - 1) {
    g[x + 1][y] = flip(g[x + 1][y]);
    document.getElementById(`flapjack-${x+1}-${y}`).innerHTML =
      `${grid[x+1][y] === 0 ? '<div class="butter"></div>' : ''}`;
  }
  if (x > 0) {
    g[x - 1][y] = flip(g[x - 1][y]);
    document.getElementById(`flapjack-${x-1}-${y}`).innerHTML =
      `${grid[x-1][y] === 0 ? '<div class="butter"></div>' : ''}`;
  }
  if (y < g.length - 1) {
    g[x][y + 1] = flip(g[x][y + 1]);
    document.getElementById(`flapjack-${x}-${y+1}`).innerHTML =
      `${grid[x][y+1] === 0 ? '<div class="butter"></div>' : ''}`;
  }
  if (y > 0) {
    g[x][y - 1] = flip(g[x][y - 1]);
    document.getElementById(`flapjack-${x}-${y-1}`).innerHTML =
      `${grid[x][y-1] === 0 ? '<div class="butter"></div>' : ''}`;
  }
  grid = g;

  if (!init) {
    if (audio) {
      snd.play();
      snd.currentTime = 0;
    }

    if (checkWin()) {
      win();
    } else {
      addClick();
    }
  }
}

function win() {
  let tweetString = `I just scored ${clicks} in %23FlapjackFwop! Can you beat me?`;
  const website = `http://cassidoo.github.io/flapjack-fwop`;
  let win = `<div class="win"><div>`
          + `<h1>You win!</h1>`
          + `<div class="result">It took you ${clicks} clicks!</div>`
          + `<a href="https://twitter.com/intent/tweet?text=${tweetString}&url=${website}&via=cassidoo" class="twitter-button"><img src="twitter.svg" />Tweet #FlapjackFwop</a>`
          + `</div></div>`;
  win = htmlToElement(win);
  document.getElementById('board').appendChild(win);

  if (localStorage.getItem('ffbestscore') === null || clicks < localStorage.getItem('ffbestscore')) {
    localStorage.setItem('ffbestscore', clicks);
  }
}

function checkWin() {
  let check = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
  ];
  return JSON.stringify(check) === JSON.stringify(grid);
}

function addClick() {
  clicks = clicks += 1;
  document.getElementById('clicks').innerHTML = clicks;
}

function flip(val) {
  return val === 0 ? 1 : 0;
}

function htmlToElement(html) {
  let template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

