//The Ant Class is responsible for the life
//functions of our virtual ants. Each ant
//has a variety of parameters that determine
//its behavior. It eats when its health is
//low, returns home when it has reached its
//carrying capacity, and has a tolerance
//level to hunger specific to each ant.

class Ant {
	
	//each ant takes in several parameter to initialize
	//let ant = new Ant(position_x,position_y,tolerance,starvation,greed,color,path[]);
  constructor(x,y,s) {
		//position of the ant
    this.position = createVector(x,y);
		
		//ant health - ant dies if it reaches 0
		this.health = 100;
		//rate at which ant health decreases when it performs an action
		this.attrition = -2.5;
		
		//determines how many offspring ant will produce
		this.fertility = random(0,3);
		
		//determines how far the ant must go to start a new hill
		this.distance = random(100,200);
		
		//how much more food an ant can carry
		this.capacity = 4;
		//total carraying limit
		this.limit = 4;
		//size of ant
		this.r = s;
		//how much food the ant is carrying
		this.food = 0;
		
		//potency of scent to lead other ants to food
		//decreases with distance traveled from food
		this.potency = 0;
		//modifier which determined the extent of potency decay
		this.potency_modifier = random(-0.01,-0.5);
		
		//health at which an ant will eat some of its food
		this.tolerance =  random(0,200);
		//health at which an ant will return home to eat
		this.starvation = random(0,this.tolerance);
		
		//true when an ant is at the hill
		this.home = false;
		//true when an ant is leaving the hill
		this.travel = false;
		//true when an ant is returniing to the hill
		this.return_home = false;
			
		//ant color - inherited from parent ant		
		this.red = random(0,255);
		this.blue = random(0,255);
		this.green = random(0,255);
		
		this.color = color(this.red,this.blue,this.green);
		
		//ant keeps track of its path so it can return to the hill
		this.path = [];
		//optimized path generated when returning home
		//allows ant to quickly return to previous point
		this.memory = [];
		
		//possible moves
		this.moves = [];
		
		//ant's hill
		this.hill = null;
  }
	
	//takes in all blocks next to ant and the block the ant is on and determines next action
	decide(moves,block){
		//check health and eat if need be
		this.vitals();
		
		if(this.path.length > this.distance){
				this.home = true;
				this.hill = new Hill(this.position.x,this.position.y);
				this.path.splice(0,this.path.length);
				return;
		}
		
		//return to hill if carrying capacity reached
		if(this.return_home){
			this.go_home(block);
			return;
		}
		
		//grab previously visited path
		let prev = this.path[this.path.length];
		
		//Array of non-blocked paths or the previous path
		let choices = [];
		//Block with strongest scent
		let max_scent = null;
		
		for(let i = 0; i < moves.length; i++){
			//grab path option if ant or obstacle is not blocking path
			if(moves[i].food > 0){
				//take food if ant can carry
				this.take(moves[i]);
				return;
			}
			if(moves[i].scent > 0){
				if(max_scent == null){
					max_scent = moves[i];
				}
				else if(moves[i].scent > max_scent.scent){
					max_scent = moves[i];
				}
			}
			if((moves[i].ants ==0) && !(moves[i].obstacle)){
				choices.push(moves[i]);
			}
		}
		
		//If scent(s) found, follow scent
		if(max_scent != null){
			this.move(max_scent,block);
			return;
		}
		
		//If there are open spaces to move to
		if(choices.length > 0){			
			//Increase unique decision paths
			shuffle(choices,true);
			//If no food or scented path, take unvisted path
			//The time complexity of this double-for-loop is negligible
			for(let j=0; j < choices.length; j++){
				let visited = false;
				for(let i=0; i < this.path.length; i++){
					if(this.path[i]==choices[j]){
						visited = true;
					}
				}
				if(!visited){
					this.move(choices[j],block);
					return;
				}
			}
			//if all moves are visited, choose random
			this.move(choices[0],block);
			return;
		}
		//if there are no open spaces go back
		else{
			//make sure there is a previous space
			if(prev != undefined){
				fill(255,0,0);
				ellipse(100,100,100);
				this.move(prev,block);
			}
			return;
		}
	}
	
	//moves the ant from one block to the next
	move(next, current){
		//Add current block to path
		this.path.push(current);
		//Move to next block
		this.position = next.position;
		//Decrement and increment ant counts
		current.removeAnt();
		next.addAnt(this);
		
		//update block display
		next.activate();
		current.activate();
		
		//decrement health
		this.health += this.attrition;
	}
	
	//removes food from block and puts in in ant inventory
	take(food_block){
		if(this.capacity > 0){
			this.potency +=1;
			this.food+= 1;
			this.capacity+= -1;
			food_block.food += -1;
			food_block.activate();
		}
		else{
			this.return_home = true;
		}
	}
	
	//removes foord from inventory and increases health
	eat(){
		if(this.food > 0){
			this.health += 20;
			this.food += -1;
			this.capacity += 1;
		}
	}
	
	//uses an efficiency algorithm to retrace an optimized path back to the hill
	go_home(curr){
			if(this.path.length > 0){
				let next = this.path.pop();
				//look ahead to see if current block appears again
				//this allows our ant to skip intersecting subpaths
				for(i=0;i<this.path.length;i++){
					if(this.path[i]==next){
						next = this.path[i];
						this.path.splice(i,this.path.length);
					}
				}
				//Add current position to path memory for future retrace
				this.memory.push(curr);
				//Move to next position in path history toward the hill
				this.position = next.position;
				
				//check vitals
				this.vitals();
				
				//Decrement and increment ant counts for relevant blocks
				curr.removeAnt();
				next.addAnt(this);
				next.activate();				
				curr.activate();
				
				//leave scent for other ants
				if(this.potency > 0){
					curr.scent += this.potency;
					this.potency += -this.potency_modifier;
				}
				
				//Use energy to move - decrement health
				this.health += this.attrition;
			}
		//reached hill - stop retracing
			else{
				this.return_home = false;
				this.home = true;
			}
	}
	
	vitals(){
		//Eat food if health is too low
		if(this.health < this.tolerance){
			this.eat();
		}
		//Return to hill if health extremely low
		if(this.health < this.starvation){
			this.return_home = true;
		}
	}
	
	reproduce(){

		let ant1 = this;
		let ant2 = new Ant(this.hill.x,this.hill.y,s);

		//inherit traits from parent (plus genetic mutation);
		ant2.fertility = ant1.fertility + random(-1,1);
		ant2.tolerance = ant1.tolerance + random(-1,1);
		ant2.starvation = ant1.starvation + random(-1,1);
		ant2.potency_modifier = ant1.potency_modifier + random(-0.01,0.01);
		ant2.distance = ant1.distance + random(-20,20);
		ant2.capacity = ant1.capacity + random(-1,1);
		ant2.limit = ant2.capacity;
		ant2.red = ant1.red + random(-20,20);
		ant2.blue = ant1.blue + random(-20,20);
		ant2.green = ant1.green + random(-20,20);

		ant2.hill = ant1.hill;

		return ant2;
		
	}
}