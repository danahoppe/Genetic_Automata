class Block{
	
	constructor(x,y,s){
		//position of block
		this.x = x;
		this.y = y;
		//scale of block
		this.s = s;
		
		//position vector
		this.position = createVector(x,y);
		
		//number of ants and food occupying block
		this.ants = 0;
		this.food = 0;
		
		//obstacle status of block
		this.obstacle = false;
		
		//ant which occupies block
		this.ant = null;
		
		//value assigned if located on path to food
		this.scent = 0;
	}
	
	//displays the block given its status
	activate() {
		//obstacle block
		if(this.obstacle){
			noStroke();
			fill(0);
			ellipse(this.x,this.y,s);
		}	
		//ant block	
		else if (this.ants > 0){
			noStroke();
			if(this.ant != null){
				fill(this.ant.red,this.ant.green,this.ant.blue);
				ellipse(this.x,this.y,s);
			}
		}
		//food block
		else if (this.food > 0){
			noStroke();
			fill(0,this.food*30,0);
			ellipse(this.x,this.y,s);
		}
		//empty block
		else{
			noStroke();
			fill(222-(this.scent*10),182 + this.scent*10,135-(this.scent*10));
			ellipse(this.x,this.y,s);
		}
		
		//decay scent on block
		this.decay();
	}
	
	//add ant to block
	addAnt(ant){
		this.ants +=1;
		this.ant = ant;
	}
	
	//remove ant from block
	removeAnt(){
		this.ants +=-1;
		this.ant = null;
	}
	
	decay(){
		//scent decrease by 20% every time it is touched
		if(this.scent>0.05){
			this.scent = this.scent * 0.70;
		}
		else{
			this.scent = 0;
		}
	}

}