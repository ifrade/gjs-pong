/*jshint moz: true, camelcase: false */
/*global imports, print*/

const collisions = function (ball, playerOne, playerTwo) {

    var that = this;
    
    // Top and bottom bouncing
    if (ball.y + ball.height >= 480 || ball.y <= 0) {
        ball.y_collision();
    }


    /* -1 is no overlap
     *  Position on the player stick (in %) were the ball has hit
     *  ---  <- 0 %
     *  | |  
     *  | |
     *  | | 
     *  --- <- 100 %
     */
    function y_overlap(ball, player) {
        let ballBottom = ball.y + ball.height;
        let ballTop = ball.y;

        let playerBottom = player.y + player.height;
        let playerTop = player.y;
        print("ball   (", ballTop, ",", ballBottom, ")");
        print("player (", playerTop, ",", playerBottom, ")");

        // 0 is top of the stage!
        if (ballBottom > playerTop && ballTop < playerBottom) {
            //print("Overlap:", ((ballBottom - playerTop) / player.height) * 100);
            return ((ballBottom - playerTop) / player.height) * 100; // player size is 100...
        } else {
            return -1;
        }
    }

    if ((ball.x + ball.width) <= 0) {
        // Player 1 score
        return -1;
    } else if (ball.x >= 640) {
        // Player 2 score
        return 1;

    } else if (ball.x === (playerOne.x + playerOne.width)) {
        print("Hit on X", ball.x);
        print("Hit on the left");

        let overlap = y_overlap(ball, playerOne);
        if (overlap !== -1) {
            ball.x_collision(overlap);
        }
    } else if ((ball.x + ball.width) === playerTwo.x) {
        print("Hit on X", ball.x);
        print("Hit on the right");
        let overlap = y_overlap(ball, playerTwo);
        if (overlap !== -1) {
            ball.x_collision(overlap);
        }
    }

    // Nothing to write home about
    return 0;
};
