// document.querySelector(".winner").classList.toggle("invisible");

document.querySelector(".btn").addEventListener("click", rollTheDice);
var timeout;

function rollTheDice() {
  this.blur(); // Unfocus the button
  clearTimeout(timeout);
  let [dice1, dice2] = generateDieRolls();
  setDiceImages(dice1, dice2);
  displayWinnerText(dice1, dice2);
}

function generateDieRolls() {
  let num1 = Math.floor(Math.random() * 6) + 1;
  let num2 = Math.floor(Math.random() * 6) + 1;
  return [num1, num2];
}

function setDiceImages(dice1, dice2) {
  document.querySelector(".dice1").setAttribute("src", `images/dice${dice1}.png`);
  document.querySelector(".dice2").setAttribute("src", `images/dice${dice2}.png`);
}

function displayWinnerText(dice1, dice2) {
  let winner;
  if ( dice1 > dice2 ) {
    winner = 1;
  } else if ( dice1 < dice2) {
    winner = 2;
  }

  let message = `Player ${winner} has won!`;

  if (dice1 == dice2) {
    message = "It is a Draw !";
  }

  winnerElem = document.querySelector(".winner");
  winnerElem.textContent = message;
  winnerElem.classList.remove("invisible");

  timeout = setTimeout(() => {
    winnerElem.classList.add("invisible");
  }, 4000);
}
