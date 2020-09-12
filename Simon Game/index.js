var buttonColors = ["green", "red", "yellow", "blue"];
var sequence = [];
var userSequence = [];
var playing = false;
var level = 0;

$(document).on("keydown", startGame);

$(".btn").on("click", function () {
  let btn = $(this);
  playAnimation(btn, "pressed", 80);
  if (playing) {
    if (getColor(btn) == userSequence.shift()) {
      if (userSequence.length == 0) {
        setTimeout(nextLevel, 500);
      }
    } else {
      $(".level-title").text("Game Over.. Press a key to restart!");
      playAudio("wrong");
      playing = false;
    }
  }
});

function startGame() {
  playing = true;
  level = 0;
  sequence = [];
  nextLevel();
}

function nextLevel() {
  level++;
  $(".level-title").text("Level " + level); // Set the title
  addToSequence();
  userSequence = [...sequence];
}

function addToSequence() {
  let newButton = getRandomButton();
  playAnimation($("." + newButton), "fade-animation", 1000);
  sequence.push(newButton);
}


function getRandomButton() {
  let randNum = Math.floor(Math.random() * 4);
  return buttonColors[randNum];
}

function playAnimation(btn, animation, duration) {
  // Start the animation
  btn.addClass(animation);
  setTimeout(() => {
    btn.removeClass(animation);
  }, duration);

  // Play the corresponding audio file.
  let color = getColor(btn);
  playAudio(color);
}

function getColor(btn) {
  return buttonColors.find( color => {
    return btn.hasClass(color)
  });
}

function playAudio(fileName) {
  let audio = new Audio("sounds/"+ fileName + ".mp3");
  audio.play();
}
