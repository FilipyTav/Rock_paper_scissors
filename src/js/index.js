import DOM_el from "./DOM_elements";

import "../styles/styles.css";

// The computer randomly chooses rock, paper or scissors
function computer_play() {
    let comp_choice = random_int(3);

    switch (comp_choice) {
        case 0:
            return {
                type: "Rock",
                icon: "R",
            };

        case 1:
            return { type: "Scissors", icon: "S" };

        case 2:
            return { type: "Paper", icon: "P" };

        default:
            return "Something went wrong with the function computer_play";
    }
}

// Gets a random int between 0 and num(exclusive)
function random_int(num) {
    return Math.floor(Math.random() * num);
}

const change_score_elements = () => {
    DOM_el.scores.computer.number.textContent = computer_score;
    DOM_el.scores.player.number.textContent = player_score;
};

// Simulates a round
function play_round(player_choice) {
    // Determines the player and the computer choice
    const computer_choice = computer_play();

    const hash = {
        rock: "scissors",
        paper: "rock",
        scissors: "paper",
    };

    transition_image(computer_choice);

    const pc_type = computer_choice.type.toLowerCase();

    switch (true) {
        case player_choice === pc_type:
            return {
                code: 0,
                message: "It's a tie!",
            };

        case hash[player_choice] === pc_type:
            return {
                code: 1,
                message: "You won!",
            };

        case hash[pc_type] === player_choice:
            return {
                code: 2,
                message: "You lost!",
            };

        default:
            return "Error in play_round";
    }
}

// Returns a message with the result of the round
function results(player_choice, computer_choice, player_win) {
    // Uppercases the first letter of each choice
    computer_choice =
        computer_choice.charAt(0).toUpperCase() + computer_choice.substr(1);

    player_choice =
        player_choice.charAt(0).toUpperCase() + player_choice.substr(1);

    // Depending on the player_win boolean, it will return the win or lose messages
    switch (player_win) {
        case true:
            return `You won! ${player_choice} beats ${computer_choice}`;

        case false:
            return `You lost! ${computer_choice} beats ${player_choice}`;
    }
}

// Scores the game and returns a final result after n rounds
function game(player_choice) {
    let player_score = 0;
    let computer_score = 0;
    let rounds = 0;

    // Changes the score depending on the winner
    let result = play_round(player_choice);

    // 0 = tie
    // 1 = player won
    // 2 = computer won
    switch (result.code) {
        case 0:
            break;

        case 1:
            rounds++;
            player_score++;
            break;

        case 2:
            rounds++;
            computer_score++;
            break;

        default:
            break;
    }

    const scores = {
        computer: computer_score,
        player: player_score,
    };

    return {
        scores,
        rounds,
    };
}

function check_scores() {
    if (player_score === max_rounds || computer_score === max_rounds) {
        const final_result_element = DOM_el.scores.final_result;
        const fr_message = final_result_element.querySelector(".message");

        final_result_element.classList.add("visible");

        switch (true) {
            case player_score === computer_score:
                fr_message.textContent = `A tie!, you've won ${player_score} times out of ${rounds}!!!`;
                break;

            case player_score > computer_score:
                fr_message.textContent = `Congrats, you've won ${player_score} times out of ${rounds}!!!`;
                break;

            case player_score < computer_score:
                fr_message.textContent = `What a shame, you've lost ${computer_score} times out of ${rounds}.`;
                break;

            default:
                return "Problem with the get_choice() function";
        }

        DOM_el.cards.player.forEach((card) =>
            card.removeEventListener("click", get_choice),
        );
    }

    return {
        player_score,
        computer_score,
        rounds,
    };
}

function get_choice(e) {
    const chosen_card = e.target.closest(".card");

    let result = game(
        chosen_card.querySelector(".type").textContent.toLowerCase(),
    );

    chosen_card.classList.add("chosen");

    DOM_el.cards.player_container.classList.add("collapsed");

    player_score += result.scores.player;
    computer_score += result.scores.computer;
    rounds += result.rounds;

    if (skip_animations) {
        DOM_el.cards.computer.classList.toggle("skipped");

        change_score_elements();

        setTimeout(() => {
            restart_round(chosen_card);
        }, 3000);
    } else {
        DOM_el.cards.computer.classList.add("ready");

        setTimeout(() => {
            change_score_elements();
        }, 5000);

        setTimeout(() => {
            restart_round(chosen_card);
        }, 7000);
    }

    collapse_cards(chosen_card);

    // Displays the final result message
    const scrs = check_scores(player_score, computer_score, rounds);

    // player_score = scrs.player_score;
    // computer_score = scrs.computer_score;
    // rounds = scrs.rounds;
}

let player_score = 0;
let computer_score = 0;
let rounds = 0;

let max_rounds = 5;

//
const choices = document.querySelector(".choices");

//

// const p_score = document.createElement("div");
// scr.appendChild(p_score);

// const c_score = document.createElement("div");
// scr.appendChild(c_score);

// Animation for the cards collapsing into each other when one of them is clicked
const collapse_cards = (chosen_card) => {
    const chosen_rect = chosen_card.getBoundingClientRect();

    const cards_rect = {};
    DOM_el.cards.player.forEach((card) => {
        if (!card.classList.contains("chosen")) {
            cards_rect[card.querySelector(".type").textContent] = {
                element: card,
                rect: card.getBoundingClientRect(),
            };
        }
    });

    const chosen_top = chosen_rect.top + window.scrollY;

    // Attracts the other cards into the one the was selected
    // by overlapping their position, using their top as reference
    for (const [key, value] of Object.entries(cards_rect)) {
        // Distance the card has to travel
        // adds scrollY to the top to get an absolute value
        const distance = chosen_top - (value.rect.top + window.scrollY);

        value.element.setAttribute(
            "style",
            `transform: translateY(${distance}px);`,
        );
    }
};

// Show what the computer picked after a brief animation
const transition_image = (chosen) => {
    const card = DOM_el.cards.computer;
    const { type, icon } = chosen;

    const symbol_el = card.querySelector(".symbol");
    const type_el = card.querySelector(".type");

    if (skip_animations) {
        type_el.textContent = type;
        symbol_el.textContent = icon;
    } else {
        setTimeout(() => {
            type_el.textContent = "Rock";
            symbol_el.textContent = "R";
        }, 1000);

        setTimeout(() => {
            type_el.textContent = "Paper";
            symbol_el.textContent = "P";
        }, 2000);

        setTimeout(() => {
            type_el.textContent = "Scissors";
            symbol_el.textContent = "S";
        }, 3000);

        setTimeout(() => {
            type_el.textContent = type;
            symbol_el.textContent = icon;
        }, 4000);
    }
};

const reset_game = () => {
    player_score = 0;
    computer_score = 0;
    rounds = 0;

    change_score_elements();

    DOM_el.scores.final_result.classList.remove("visible");
};

const main = () => {
    DOM_el.cards.player.forEach((card) =>
        card.addEventListener("click", get_choice),
    );

    DOM_el.skip_animations.addEventListener("click", (e) => {
        const button = e.target;
        button.classList.toggle("selected");

        skip_animations = !skip_animations;

        if (button.classList.contains("selected")) {
            button.textContent = "Show animations";
        } else {
            button.textContent = "Skip animations";
        }
    });

    change_score_elements();

    DOM_el.scores.final_result.addEventListener("click", reset_game);
};

main();

let skip_animations = false;

const restart_round = (chosen_card) => {
    const comp_card = DOM_el.cards.computer;

    comp_card.classList.remove("ready");

    DOM_el.cards.player_container.classList.remove("collapsed");

    comp_card.querySelector(".symbol").textContent = "?";
    comp_card.querySelector(".type").innerHTML =
        "Waiting <span>.</span> <span>.</span> <span>.</span>";

    DOM_el.cards.player.forEach((card) => {
        if (!card.classList.contains("chosen")) {
            card.setAttribute("style", "");
        }
    });

    chosen_card.classList.remove("chosen");
};
