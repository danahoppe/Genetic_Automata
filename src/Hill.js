class Hill{
  constructor(x,y){
    this.x = x;
    this.y = y;
    
    this.food = 0;
  }
  
  show(){
    stroke(0);
    strokeWeight(1);
    fill(this.food*10,this.food*5,this.food*2);
    ellipse(this.x,this.y,this.food/2);
  }
}
