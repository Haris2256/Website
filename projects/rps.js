const choices = ["rock", "paper", "scissors"];

function changeIcon(iconID, selection) {
    iconID.className = selection;
}

function convertIcon(selection) {
    if (selection === "rock") {
        return "fa-solid fa-hand-back-fist";
    } else if (selection === "paper") {
        return "fa-solid fa-hand";
    } else {
        return "fa-solid fa-hand-scissors";
    }
}

function restartAnimation(player) {
    let iconID = document.getElementById(player+"-move-icon");
    iconID.style.animationName = "none";
    requestAnimationFrame(() => {
        iconID.style.animationName = "";
    });
}

let playerMoves = [];

function computerPlay() {
    if (playerMoves.length >= 2) {
        let lastMove = playerMoves[playerMoves.length - 1];
        let moveCount = [0, 0, 0];

        for (let i = playerMoves.length - 1; i >= 0 && playerMoves.length - i <= 20; i--) {
            if (playerMoves[i] === lastMove) {
                let nextMove = playerMoves[i + 1];
                if (nextMove === "rock") {
                    moveCount[0]++;
                } else if (nextMove === "paper") {
                    moveCount[1]++;
                } else if (nextMove === "scissors") {
                    moveCount[2]++;
                }
            }
        }

        let predictedMove = "rock"; // default
        let max = -1;
        for (let i = 0; i < moveCount.length; i++) {
            if (moveCount[i] > max) {
                max = moveCount[i];
                predictedMove = choices[i];
            }
        }

        if (predictedMove === "rock") return "paper";     // paper beats rock
        if (predictedMove === "paper") return "scissors"; // scissors beat paper
        if (predictedMove === "scissors") return "rock";  // rock beats scissors

    } else {
        // Not enough history, pick random
        return choices[Math.floor(Math.random() * choices.length)];
    }
}

function playRound(playerSelection, computerSelection) {
    playerMoves.push(playerSelection);
    if (playerSelection === computerSelection) {
        return "It's a tie!";
    } else if (
        (playerSelection === "rock" && computerSelection === "scissors") ||
        (playerSelection === "paper" && computerSelection === "rock") ||
        (playerSelection === "scissors" && computerSelection === "paper")
    ) {
        const humanScore = document.getElementById("human-score");
        const text = humanScore.textContent;
        var number = parseInt(text.match(/\d+/)[0]);
        number++;
        humanScore.textContent = "Human: " + number;
        return "You win!";
    } else {
        const computerScore = document.getElementById("computer-score");
        const text = computerScore.textContent;
        var number = parseInt(text.match(/\d+/)[0]);
        number++;
        computerScore.textContent = "Computer: " + number;
        return "You lose!";
    }
}

const buttons = document.querySelectorAll("button");

buttons.forEach(button => {
    button.addEventListener("click", function() {
        const classNames = button.className.split(" ");
        const playerSelection = classNames[classNames.length - 1];
        changeIcon(document.getElementById("human-move-icon"), convertIcon(playerSelection));
        document.getElementById("human-move-icon").classList.add("humanSlideDown");
        restartAnimation("human");
        const computerSelection = computerPlay();
        changeIcon(document.getElementById("computer-move-icon"), convertIcon(computerSelection));
        document.getElementById("computer-move-icon").classList.add("computerSlideDown");
        restartAnimation("computer");
        const result = playRound(playerSelection, computerSelection);
        document.querySelector(".result").textContent = result;
    });
});

$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });

  


