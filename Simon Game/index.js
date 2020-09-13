var buttonColors = ["green", "red", "yellow", "blue"];
var sequence = []; // The complete sequence of the current game
var userSequence = []; // The sequence that the user has yet to play on the current level
var playing = false;
var level = 0;

$(document).on("keydown", startGame);

/*
 * when a button is clicked play the animation.
 * If the game is not on the state 'playing' nothing else happens.
 * Otherwise, the button clicked has to be the same as the next button from the
 * player's remaining sequence. When the player's sequence has no other items, the
 * level is completed and after 1 second the next level starts. If the player clicked
 * the wrong button, the game ends.
 */
$(".btn").on("click", function () {
  let btn = $(this);
  playAnimation(btn, "pressed", 80);
  if (playing) {
    if (getColor(btn) == userSequence.shift()) {
      if (userSequence.length == 0) {
        setTimeout(nextLevel, 700);
      }
    } else {
      gameOver();
    }
  }
});


/*
 * When the game ends set the appropriate title and playing state. Also, play
 * a losing sound after a short delay, so that it does not overlap with the
 * sound of the button.
 */
function gameOver() {
  $(".level-title").text("Game Over.. Press a key to restart!");
  playing = false;
  setTimeout(() => playAudio("wrong"), 300);
}

/*
 * Sets the starting point of the game by setting the state to playing, resetting
 * the level and the game sequence.
 */
function startGame() {
  playing = true;
  level = 0;
  sequence = [];
  nextLevel();
}

/*
 * To start a new level, increase the level counter and display it. Then, add a
 * new button to the game sequence and set that to be the user remaining sequence.
 */
function nextLevel() {
  level++;
  $(".level-title").text("Level " + level); // Set the title
  addToSequence();
  userSequence = [...sequence];
}

/*
 * Picks a random color, plays the animation of the corresponding button and then
 * adds the new color to the game sequence.
 */
function addToSequence() {
  let newColor = getRandomColor();
  playAnimation($("." + newColor), "fade-animation", 1000);
  sequence.push(newColor);
}

// Returns a random color from [red, blue, green, yellow].
function getRandomColor() {
  let randNum = Math.floor(Math.random() * 4); // Get an index in range [0,3]
  return buttonColors[randNum];
}

/*
 * Plays an animation on the specified button for the duration. The animations
 * are defined by the corresponding css classes. When an animation is triggered
 * a counterpart sound is played.
 */
function playAnimation(btn, animation, duration) {

  btn.addClass(animation);
  setTimeout(() => {
    btn.removeClass(animation);
  }, duration);

  let color = getColor(btn);
  playAudio(color);
}

// For a specified html button element returns it's color.
function getColor(btn) {
  return buttonColors.find( color => {
    return btn.hasClass(color)
  });
}

// Plays the audio file in the 'sounds' folder with name fileName.mp3.
function playAudio(fileName) {
  let audio = new Audio("sounds/"+ fileName + ".mp3");
  audio.play();
}
