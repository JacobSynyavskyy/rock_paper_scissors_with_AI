const choices = ['камінь', 'ножиці', 'папір'];
let playerScore = 0;
let computerScore = 0;
let difficulty = 0;

let moveCounts = { 'камінь': 0, 'ножиці': 0, 'папір': 0 };
let firstLevel = {
  'камінь': { 'камінь': 0, 'ножиці': 0, 'папір': 0 },
  'ножиці': { 'камінь': 0, 'ножиці': 0, 'папір': 0 },
  'папір': { 'камінь': 0, 'ножиці': 0, 'папір': 0 }
};
let secondLevel = {};
let prevMove = null;
let prevPrevMove = null;

function setLevel(lvl) {
  difficulty = lvl;
  document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('selected'));
  document.querySelectorAll('.level-btn')[lvl].classList.add('selected');
}

function updateScores() {
  document.getElementById('playerScore').textContent = playerScore;
  document.getElementById('computerScore').textContent = computerScore;
}

function play(playerChoice) {
  decayWeights();
  const computerChoice = getComputerChoice();
  let result = '', resultClass = '';

  if (playerChoice === computerChoice) {
    result = 'Нічия!';
    playerScore += 0.5;
    computerScore += 0.5;
    resultClass = 'draw';
  } else if (
    (playerChoice === 'камінь' && computerChoice === 'ножиці') ||
    (playerChoice === 'ножиці' && computerChoice === 'папір') ||
    (playerChoice === 'папір' && computerChoice === 'камінь')
  ) {
    result = 'Ти переміг!';
    playerScore += 1;
    resultClass = 'win';
  } else {
    result = "Комп'ютер переміг!";
    computerScore += 1;
    resultClass = 'lose';
  }

  document.getElementById('result').innerHTML = `
    Ти вибрав: <b>${playerChoice}</b><br>
    Комп'ютер вибрав: <b>${computerChoice}</b><br>
    <span class="${resultClass}">${result}</span>
  `;

  recordMove(playerChoice);
  updateScores();
}

function getComputerChoice() {
  if (difficulty === 0) {
    return choices[Math.floor(Math.random() * 3)];
  }

  if (difficulty === 1) {
    let maxMove = getMaxKey(moveCounts);
    if (Math.random() < 0.5) {
      return counterMove(maxMove);
    } else {
      return choices[Math.floor(Math.random() * 3)];
    }
  }

  if (difficulty === 2 && prevMove) {
    let predMove = getMaxKey(firstLevel[prevMove]);
    return counterMove(predMove);
  }

  if (difficulty === 3 && prevMove && prevPrevMove) {
    let key = `${prevPrevMove},${prevMove}`;
    if (!secondLevel[key]) secondLevel[key] = { 'камінь': 0, 'ножиці': 0, 'папір': 0 };
    let predMove = getMaxKey(secondLevel[key]);
    return counterMove(predMove);
  }

  return choices[Math.floor(Math.random() * 3)];
}

function counterMove(move) {
  if (move === 'камінь') return 'папір';
  if (move === 'папір') return 'ножиці';
  if (move === 'ножиці') return 'камінь';
  return choices[Math.floor(Math.random() * 3)];
}

function getMaxKey(obj) {
  return Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b);
}

function recordMove(playerMove) {
  moveCounts[playerMove]++;

  if (prevMove) {
    firstLevel[prevMove][playerMove]++;
  }

  if (prevPrevMove && prevMove) {
    let key = `${prevPrevMove},${prevMove}`;
    if (!secondLevel[key]) {
      secondLevel[key] = { 'камінь': 0, 'ножиці': 0, 'папір': 0 };
    }
    secondLevel[key][playerMove]++;
  }

  prevPrevMove = prevMove;
  prevMove = playerMove;
}

function decayWeights() {
  for (let move in moveCounts) moveCounts[move] *= 0.9;
  for (let prev in firstLevel)
    for (let next in firstLevel[prev])
      firstLevel[prev][next] *= 0.9;
  for (let key in secondLevel)
    for (let move in secondLevel[key])
      secondLevel[key][move] *= 0.9;
}
