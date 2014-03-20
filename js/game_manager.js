function GameManager(size, InputManager, Actuator, ScoreManager) {
  this.size         = size; // Size of the grid
  this.inputManager = new InputManager;
  this.scoreManager = new ScoreManager;
  this.actuator     = new Actuator;

  this.startTiles   = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
    this.actuator.continue();
    this.game.setup();
};

// Keep playing after winning
GameManager.prototype.keepPlaying = function () {
    this.keepPlaying = true;
    this.actuator.continue();
};

GameManager.prototype.isGameTerminated = function () {
    return this.game.isGameTerminated();
};

// Set up the game
GameManager.prototype.setup = function () {
    this.game = new Game(this.size, false);
    this.game.setup();

    // Update the actuator
    this.actuate();
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.scoreManager.get() < this.game.score) {
    this.scoreManager.set(this.game.score);
  }

  this.actuator.actuate(this.game.grid, {
    score:      this.game.score,
    over:       this.game.over,
    won:        this.game.won,
    bestScore:  this.scoreManager.get(),
    terminated: this.isGameTerminated()
  });

};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
    // 0: up, 1: right, 2:down, 3: left
    var moved = this.game.move(direction);

    if(moved) {
        this.actuate();
    }
};
