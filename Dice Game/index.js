// When the button is clicked, roll the dice.
document.querySelector(".btn").addEventListener("click", rollTheDice);

var visibleTimeout, blurTimeout; // The timeouts for the animations
var lastClicked = 0;

/*
 * The rolling of the dice, clears the timers of the animations, generates the
 * new dice rolls, sets the new images and lastly displays the winner.
 */
function rollTheDice() {
  let curClick = new Date().getTime();
  if (curClick - lastClicked < 1000) return;
  lastClicked = curClick;

  this.blur(); // Unfocus the button
  clearTimeout(visibleTimeout);
  clearTimeout(blurTimeout);

  let [roll1, roll2] = generateDieRolls();
  setDiceImages(roll1, roll2);
  displayWinner(roll1, roll2);
}


// Generates two random numbers in the range [1, 6] and returns them.
function generateDieRolls() {
  let num1 = Math.floor(Math.random() * 6) + 1;
  let num2 = Math.floor(Math.random() * 6) + 1;
  return [num1, num2];
}

/*
 * Sets the dice images of the new rolls. Firstly, starts the css blur animation
 * on the images. At the middle of the animation, changes the images and then
 * removes the blurred class, so that the animation can be reactivated.
 */
function setDiceImages(roll1, roll2) {
  let dice1 = document.querySelector(".dice1");
  let dice2 = document.querySelector(".dice2");

  dice1.classList.add('blurred');
  dice2.classList.add('blurred');

  setTimeout(() => {
    dice1.setAttribute("src", `images/dice${roll1}.png`);
    dice2.setAttribute("src", `images/dice${roll2}.png`);
  }, 500);

  blurTimeout = setTimeout(() => {
    dice1.classList.remove('blurred');
    dice2.classList.remove('blurred');
  }, 1000);
}

/*
 * Calculates the winner depending on the bigger roll and sets the appropriate
 * message to be displayed. Then, initiates the css animation to fade in the
 * message. After 4 seconds, the winner message dissapears.
 */
function displayWinner(roll1, roll2) {
  let winner;
  if ( roll1 > roll2 ) {
    winner = 1;
  } else if ( roll1 < roll2) {
    winner = 2;
  }

  let message = `Player ${winner} has won!`;

  if (roll1 == roll2) {
    message = "It is a Draw !";
  }

  winnerElem = document.querySelector(".winner");
  winnerElem.textContent = message;
  winnerElem.classList.add("visible");

  visibleTimeout = setTimeout(() => {
    winnerElem.classList.remove("visible");
  }, 2000);
}
