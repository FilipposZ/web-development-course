document.querySelectorAll(".drum").forEach( btn => {
  btn.addEventListener("click", function () {
    playSound(this.textContent);
  })
});

document.addEventListener("keydown", function (e) {
  playSound(e.key);
});

function playSound(key) {
  buttonAnimation(key);
  let sound;
  switch (key) {
    case "w":
      sound = new Audio("sounds/crash.mp3");
      sound.volume = 0.2;
      break;
    case "a":
      sound = new Audio("sounds/kick-bass.mp3");
      break;
    case "s":
      sound = new Audio("sounds/snare.mp3");
      break;
    case "d":
      sound = new Audio("sounds/tom-1.mp3");
      break;
    case "j":
      sound = new Audio("sounds/tom-2.mp3");
      break;
    case "k":
      sound = new Audio("sounds/tom-3.mp3");
      break;
    case "l":
      sound = new Audio("sounds/tom-4.mp3");
      break;
    default:
      console.log(this.textContent);
  }

  sound.play();
}

function buttonAnimation(key) {
  let activeBtn = document.querySelector("." + key)
  activeBtn.classList.add("pressed");

  setTimeout( () => {
    activeBtn.classList.remove("pressed");
  }, 100);
}
