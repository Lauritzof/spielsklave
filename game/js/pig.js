/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

/**
This is the pig charakter.
The player can take over the controll of
this or even a second player can handle
this character with the mouse.player

In single player the pig is controled 
like the demon.

@param {object} world - The current state
@param {number} x - The initial x-position
@param {number} y - The initial y-position

@return {Phaser.Sprite} - The pig object
*/
var Pig = function(world, x, y) {
	var pig = game.add.sprite(x, y, "atlas", "pig_walk_down_1", world.middleLayer);
	
	//Configure physics
	game.physics.ninja.enable(pig, 1, 0, 4);
    pig.body.drag = 0.1;
    pig.body.immovable = true;
	
    //Config body size and alignment
	pig.anchor.set(0.5, 0.8);
	pig.body.setSize(8,8);

	//Prepare animations
	pig.animations.add("stand_up", ["pig_walk_up_1"], 24, true, true);
	pig.animations.add("stand_down", ["pig_walk_down_1"], 12, true, true);
	pig.animations.add("stand_left", ["pig_walk_left_1"], 12, true, true);
	pig.animations.add("stand_right", ["pig_walk_right_1"], 12, true, true);
	pig.animations.add("walk_down", ["pig_walk_down_0", "pig_walk_down_1", "pig_walk_down_2", "pig_walk_down_3"], 12, true, true);
	pig.animations.add("walk_up", ["pig_walk_up_0", "pig_walk_up_1", "pig_walk_up_2", "pig_walk_up_3"], 12, true, true);
	pig.animations.add("walk_left", ["pig_walk_left_0", "pig_walk_left_1", "pig_walk_left_2", "pig_walk_left_3"], 12, true, true);
	pig.animations.add("walk_right", ["pig_walk_right_0", "pig_walk_right_1", "pig_walk_right_2", "pig_walk_right_3"], 12, true, true);
	pig.animations.play("stand_down");

	//Private variables
	var speed = 100;
	var minDis = 30;
	var lookDirection = DOWN;
	var walkSave = true;

	pig.humanInput = false;

	/**
	The pig will follow the player if its not controlled by a human.
	May be some pathfinding will be added later.
	*/
	pig.update = function() {
		if (pig.humanInput) return;
		var follow = world.cursor.visible ? world.cursor : world.player.body;
		minDis = world.cursor.visible ? 2 : 30;
		var distance = game.math.distance(follow.x, follow.y, pig.body.x, pig.body.y);

		var dirKey = Math.round(game.math.angleBetweenPoints(pig, follow) / Math.PI * 2);

		switch (dirKey) {
			case 0: lookDirection = RIGHT; break;
			case 1: lookDirection = DOWN; break;
			case -2:
			case 2: lookDirection = LEFT; break;
			case -1: lookDirection = UP; break;
		}

		if (distance > minDis){
			var direction = {
				x: (follow.x - pig.body.x) / distance,
				y: (follow.y - pig.body.y) / distance
			}

			pig.body.x += direction.x * speed * DT;
			pig.body.y += direction.y * speed * DT;


			pig.animations.play("walk_" + lookDirection);
			walkSave = true;
		} else {
			if (walkSave) {
				walkSave = false;
			} else {
				pig.animations.play("stand_" + lookDirection);
			}
			
			
		}
	}

	/*
	Handels the input from Pad class. Has to be called every frame.
	*/
	pig.input = function() {
		if (pig.humanInput == false) return;
		var stand = true;
		var newAnimation = "stand";

		var diagonalFactor = (Pad.isDown(Pad.LEFT) || Pad.isDown(Pad.RIGHT)) && (Pad.isDown(Pad.UP) || Pad.isDown(Pad.DOWN)) ? 0.707 : 1; 

		//Process movement and animation
		if (pig.humanInput && !(Pad.isDown(Pad.LEFT) && Pad.isDown(Pad.RIGHT)) && !(Pad.isDown(Pad.UP) && Pad.isDown(Pad.DOWN))) {
			function setMove(padKey,axis, multi,dirID) {
				if (Pad.isDown(padKey)) {
					pig.body[axis] += DT * speed * diagonalFactor * multi;
					stand = false;
					lookDirection = dirID;
				}
			}
			setMove(Pad.LEFT, "x", -1, LEFT);
			setMove(Pad.RIGHT, "x", 1, RIGHT);
			setMove(Pad.UP, "y", -1, UP);
			setMove(Pad.DOWN, "y", 1, DOWN);

			if (pig.animations.currentAnim.name.includes("stand") || diagonalFactor == 1) {
				pig.animations.play("walk_" + lookDirection);
			}
		}
	
		if (stand) {
			pig.animations.play("stand_" + lookDirection);
		}


		if (Pad.justDown(Pad.JUMP)) {
			
		}
		if (Pad.justDown(Pad.SHOOT)) {
			
		}

	}

	return pig;
}