let ants = [];
let blocks = [];
let hill;
let origin;

let fr = 15;

let s = 2;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(255);
	origin = createVector(400,400);
	
	//create ant hill
	hill = new Hill(origin.x,origin.y);
	
	for(let j = 0; j < 100; j++){		
		let ant = new Ant(origin.x,origin.y,s);
		ant.fertility = random(1,4);
		ant.hill = hill;
		ants.push(ant);
	}
	
	origin.x = 800;
	origin.y = 400;
	
	//create ant hill
	hill2 = new Hill(origin.x,origin.y);
	
	for(let j = 0; j < 100; j++){		
		let ant = new Ant(origin.x,origin.y,s);
		ant.fertility = random(1,4);
		ant.hill = hill2;
		ants.push(ant);
	}
	
	
	
	//generate blocks
	for(i=0; i<=width; i+=s){
		blocks [i] = [];
		for(j=0; j<=height; j+=s){
			block = new Block(i,j,s);
			let rand = random(0,10);
			if(rand > 9.5){
				block.obstacle = true;
			}
			else if(rand>9.2){
				block.food = random(50,300);
			}
			
			if(i == width || i == 0 || j == height || j == 0){
				block.obstacle = true;
			}
			blocks [i][j] = block;
			block.activate();
		}
	}
}

function draw() {
	//set frame rate
	frameRate(fr);
	//iterate through ants
	for(let a = 0; a < ants.length; a ++){
		//grab ant
		let ant1 = ants[a];
		
		//simulate ant if living
		if(ant1.health > 0){
			//generate all possible moves
			let moves = generate_moves(ant1);
			//current block which ant occupies
			let current = blocks[ant1.position.x][ant1.position.y];
			//determine ant movement
			ant1.decide(moves, current);
			
			//check to see if ant is at the hill
			success = ant1.hill.visit(ant1);
			if(success){
				for(let i = 0; i < ant1.fertility; i++){
					new_ant = ant1.reproduce();	
					ants.push(new_ant);
				}
			}
		}
		//remove dead ants from simulation
		else{
				ants.splice(a, 1);
				blocks[ant1.position.x][ant1.position.y].ants += -1;
				fill(255,0,0);
				ellipse(ant1.position.x,ant1.position.y,s);
		}
	}
}

//generate all possible blocks an ant could choose from
function generate_moves(ant1) {	
			let moves = [];
			moves.push(blocks[ant1.position.x + s][ant1.position.y]);
			moves.push(blocks[ant1.position.x - s][ant1.position.y]);
			moves.push(blocks[ant1.position.x][ant1.position.y + s]);
			moves.push(blocks[ant1.position.x][ant1.position.y - s]);
			moves.push(blocks[ant1.position.x + s][ant1.position.y + s]);
			moves.push(blocks[ant1.position.x - s][ant1.position.y + s]);
			moves.push(blocks[ant1.position.x - s][ant1.position.y - s]);
			moves.push(blocks[ant1.position.x + s][ant1.position.y - s]);
		
			return moves;
	}

//control frame rate
function keyPressed() {
  if (keyCode === UP_ARROW) {
    fr++;
  } else if (keyCode === DOWN_ARROW) {
		if(fr>1){
			fr--; 
		}    
  }
  return false; // prevent default
}