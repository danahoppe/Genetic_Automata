let ants = [];
let blocks = [];
let hill;
let origin;

let fr = 15;

let s = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  origin = createVector(400,400);
  
  for(let j = 0; j < 100; j++){    
    let ant = new Ant(origin.x,origin.y,s);
    ant.fertility = random(1,4);
    ants.push(ant);
  }
  
  //create ant hill
  hill = new Hill(origin.x,origin.y);
  
  //generate blocks
  for(i=0; i<=width; i+=s){
    blocks [i] = [];
    for(j=0; j<=height; j+=s){
      block = new Block(i,j,s);
      let rand = random(0,10);
      if(rand > 9){
        block.obstacle = true;
      }
      else if(rand>8.9){
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
      if(ant1.home){
        if(hill.food > 0){
          if(ant1.food > (ant1.limit/2)){
            for(i = 0; i < ant1.fertility; i++){
              ant2 = new Ant(origin.x,origin.y,s);
  
              //inherit traits from parent (plus genetic mutation);
              ant2.fertility = ant1.fertility + random(-0.1,1);
              ant2.tolerance = ant1.tolerance + random(-1,1);
              ant2.starvation = ant1.starvation + random(-1,1);
              ant2.potency_modifier = ant1.potency_modifier + random(-0.01,0.01);
              ant2.color = ant1.color;
              ants.push(ant2);
            }
          }
        }
        //Deposit food at hill
        hill.food+= ant1.food;
        ant1.food = 0;
        
        //Increase ant carrying capacity
        ant1.limit +=1;
        ant1.capacity = ant1.limit;
        
        //Eat hill food if desperate
        if(hill.food > 10){
          if(ant1.health < ant1.starvation){
            ant1.health += 30;
            hill.food += -1;
          }          
        }
        //ant returns to searching
        ant1.home = false;
      }      
      hill.show();
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
