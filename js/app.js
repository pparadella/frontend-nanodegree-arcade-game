//função que calcula a velocidade dos inimigos.
function randomSpeed () {
  var speed = Math.floor((Math.random()*500)+200);
  return speed;
}

//função para resetar a fase
function reset () {
  allEnemies = [new Enemy(1), new Enemy(2), new Enemy(3)];
  //player = new Player();
  player.reset();
}

// Enemies our player must avoid
var Enemy = function(num) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  //posição do inimigo
  this.x = (num * 200);
  //this.y = (Math.floor((Math.random()*3)+1)*83)-26;
  this.y = (num * 83) - 26;

  //velocidade do inimigo
  this.speed = randomSpeed();

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

  //como o inimigo vai andar
  this.x = this.x + (this.speed*dt);

  //sistema de colisão
  if (this.y === player.y+9 && (this.x+70 >= player.x && this.x+70 <= player.x+101)){
    if (player.score > 0){
      //retirar 1 do score do player
      player.score = player.score - 1;
    }
    //e resetar a fase
    reset();
  }

  //caso fique fora da tela ele volta para o inicio e com uma velocidade diferente
  if (this.x > 505){
    this.reset();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {
  //sistema de reset quando ele fica fora da tela
  this.x = -101;
  //this.y = (Math.floor((Math.random()*3)+1)*83)-26;
  this.speed = randomSpeed();
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (){
  //colocando o score inicial do player
  this.score = 0;
  //posição inicial
  this.x = 202;
  this.y = 380;

  //sprite default
  this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function(dt) {
  //sistema caso o player consiga chegar no final da fase
  if (this.y < 48) {
    //adicionar 1 ao score e resetar
    this.score = this.score + 1;
    reset();
  }
};

//Renderizando o player
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//metodo para fazer o player andar
Player.prototype.handleInput = function(e) {
  if (e === "up" && this.y >= 48){
    this.y = this.y - 83;
  }
  if (e === "down" && this.y <= 297){
    this.y = this.y + 83;
  }
  if (e === "left" && this.x >= 101){
    this.x = this.x - 101;
  }
  if (e === "right" && this.x <= 303){
    this.x = this.x + 101;
  }

};

//metodo para resetar o player na posição inicial
Player.prototype.reset = function() {
  this.x = 202;
  this.y = 380;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
//var allEnemies = [new Enemy(1), new Enemy(2), new Enemy(3)];
// Place the player object in a variable called player
//var player = new Player();
var player = new Player();
reset();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
