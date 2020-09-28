class Hill{
	constructor(x,y){
    //position coordinates
		this.x = x;
		this.y = y;
    
    //food quantity
		this.food = 0;
	}
  
  //display hill on screen
	show(){
		noStroke();
    strokeWeight(1);
    //size is correlated to food count
		fill(this.food,this.food/5,this.food/5);
		ellipse(this.x,this.y,this.food/50);
	}
  
  //handles ant returning to hill
	visit(ant){
		let ant1 = ant;
		let hill = this;
		let reproduce = false;
		
		if(ant1.home){
      //ant will reproduce if bringing food for hill
				if(ant1.food > ant1.limit/2){
						reproduce = true;
        }
        //deposit food
				hill.food+= ant1.food;
				ant1.food = 0;
				ant1.limit +=1;
				ant1.capacity = ant1.limit;
        
        //ant can take food from hill if health is low
				if(hill.food > 10){
					if(ant1.health < 30){
						ant1.health += 20;
						hill.food += -1;
					}					
				}
				ant1.home = false;
				ant1.travel = true;
			}			
			hill.show();
			return reproduce;
	}
	
}