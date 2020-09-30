import { Game } from "./game";

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var game = Game.first_instance();
        // game.changeToScene("welcomeScene");
        game.loadAndChangeToScene("welcomeScene");
    }
}
new App();