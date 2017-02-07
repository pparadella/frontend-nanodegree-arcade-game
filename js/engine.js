/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);


    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */

    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render("yes");

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */

         //colocar o score na tela.
        ctx.font = '26pt impact';
        ctx.fillStyle = "black";
        ctx.clearRect(canvas.width-156 ,0,136,36);
        ctx.fillText("Score: ",canvas.width-90,36);
        ctx.fillText(player.score,canvas.width-36,36);

        //se Player atingiu 6 no score ele ganha senão continua a execução do main
        if (player.score === 6){
          youWin();
        }else {
          win.requestAnimationFrame(main);
        }

    }

    function youWin(){
       var elemLeft = canvas.offsetLeft,
       elemTop = canvas.offsetTop;

       //colocando mensagem de vitoria na tela
       ctx.font = '46pt impact';
       ctx.textAlign = "center";
       ctx.fillStyle = "black";
       ctx.fillText("You WIN!",canvas.width/2,canvas.height/2);
       ctx.font = '26pt impact';
       ctx.fillStyle = "green";
       ctx.strokeStyle = "white";
       ctx.fillText("Play Again",canvas.width/2,(canvas.height/2)+60);
       ctx.strokeText("Play Again",canvas.width/2,(canvas.height/2)+60);

       //Evento de clique para jogar novamente
       canvas.addEventListener('click', function myClick(e){
         var x = e.pageX - elemLeft;
         var y = e.pageY - elemTop;
         //Quando o player clica no play again, reinicia o jogo e vai para a tela de escolha de characters.
         if (y >= (canvas.height/2)+30  && y <= (canvas.height/2)+64){
             if (x >= (canvas.width/2)-80 && x <= (canvas.width/2)+80){
                canvas.removeEventListener('click', myClick);
                init();
             }

         }
       },false);
    }
    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        //main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
            //se colidir retira score do player e reseta a fase
            if (enemy.collides(player)){
              if (player.score > 0){
                //retirar 1 do score do player
                player.score = player.score - 1;
              }
              //resetando todos os inimigos
              allEnemies.forEach(function(enemy){
                enemy.reset();
              });
              //resetando o player
              player.reset();

            }
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render(state) {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        //para saber se renderiza a fase sem ou com os objetos
        if (state === "no"){

        }else {
            renderEntities();
        }

    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
        //var game = 0;
        //resetar o score
        player.score = 0;
        ctx.clearRect(canvas.width-156 ,0,136,36);
        ctx.clearRect(canvas.width-56 ,0,36,36);

        //Para saber onde o mouse vai estar no canvas
        var elemLeft = canvas.offsetLeft,
        elemTop = canvas.offsetTop;

        //renderizar a parte do fundo da fazer sem os objetos
        render("no");

        //renderizar os characters que podem ser escolhido
        ctx.font = '36pt impact';
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.fillText("Choose your character:",canvas.width/2,250);
        ctx.drawImage(Resources.get("images/char-boy.png"), 0, 300);
        ctx.drawImage(Resources.get("images/char-cat-girl.png"), 101, 300);
        ctx.drawImage(Resources.get("images/char-horn-girl.png"), 202, 300);
        ctx.drawImage(Resources.get("images/char-pink-girl.png"), 303, 300);
        ctx.drawImage(Resources.get("images/char-princess-girl.png"), 404, 300);

        //evento de click para saber qual character foi escolhido
        //chama o main depois que é escolhido
        canvas.addEventListener('click', function myClick(e) {
          var x = e.pageX - elemLeft;
          var y = e.pageY - elemTop;
          if (y >= 360 && y <= 462){
            if (x >= 0 && x <= 101){
              player.sprite = 'images/char-boy.png';
              main();
              canvas.removeEventListener('click', myClick);
            }else if (x >= 102 && x <= 202) {
              player.sprite = 'images/char-cat-girl.png';
              main();
              canvas.removeEventListener('click', myClick);
            }else if (x >= 203 && x <= 303) {
              player.sprite = 'images/char-horn-girl.png';
              main();
              canvas.removeEventListener('click', myClick);
            }else if (x >= 304 && x <= 404) {
              player.sprite = 'images/char-pink-girl.png';
              main();
              canvas.removeEventListener('click', myClick);
            }else if (x >= 404 && x <= 505) {
              player.sprite = 'images/char-princess-girl.png';
              main();
              canvas.removeEventListener('click', myClick);
            }
          }

        }, false);


    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'

    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
