class Hill{
	constructor(x,y){
		this.x = x;
		this.y = y;
		
		this.food = 0;
	}
	
	show(){
		noStroke();
		strokeWeight(1);
		fill(this.food,this.food/5,this.food/5);
		ellipse(this.x,this.y,this.food/50);
	}
	
	visit(ant){
		let ant1 = ant;
		let hill = this;
		let reproduce = false;
		
		if(ant1.home){
				if(ant1.food > ant1.limit/2){
						reproduce = true;
				}
				hill.food+= ant1.food;
				ant1.food = 0;
				ant1.limit +=1;
				ant1.capacity = ant1.limit;
				
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