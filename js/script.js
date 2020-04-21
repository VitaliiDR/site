const canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
		canvas.style.background = 'lightblue';

function touchTop(person, object){
	if(person.position.y + person.h >= object.position.y && person.position.y < object.position.y + object.h && person.position.x + 10 < object.position.x + object.w && person.position.x + person.w - 10 > object.position.x){
		return true;
	}else{
		return false;
	}
}
function touchLeft(person, object){
	if(person.position.x + person.w >= object.position.x && person.position.x + person.w <= object.position.x + object.w && person.position.y + person.h > object.position.y && person.position.y < object.position.y + object.h){
		return true;
	}else{
		return false;
	}
	}
function touchRight(person, object){
	if(person.position.x <= object.position.x + object.w && person.position.x >= object.position.x && person.position.y + person.h > object.position.y && person.position.y < object.position.y + object.h){
		return true;
	}else{
		return false;
	}
}

function build(game, arr){
	let arrFor = [];
	arr.forEach((object, objectIndex) => {
		if(object == 1){
			let position = {
				x: (210 - 22) * objectIndex,
				y: height - 146,
			}
			arrFor.push(new Ground(game, position));
		}
	});
	return arrFor;
}

class Game{
	constructor(width, height){
		this.stop = false;
		this.objects = [];
		this.obstacle = [];
		this.ground = [];
		this.groundItem = [];
		this.paused = true;
		this.pauseTap = true;
	}
	start(){
		for(let i = 0; i < Math.floor(width/210 + 3); i++){
			this.groundItem.push(1);
		}
		this.cloud1 = new Cloud1(this);
		this.cloud2 = new Cloud2(this);
		this.cloud3 = new Cloud3(this);
		this.cloud4 = new Cloud4(this);
		this.ground = build(this, this.groundItem);
		this.person = new Person(this);
		this.obstacle = [new Obstacle(this, {x: width, y: height - game.ground[0].h - 65}), new Obstacle(this, {x: width * 1.333, y: height - game.ground[0].h - 65}), new Obstacle(this, {x: width * 1.667, y: height - game.ground[0].h - 65})];

		this.key = new Key(this);

		this.objects = [this.cloud1, this.cloud2, this.cloud3, this.cloud4, ...this.ground, this.person, ...this.obstacle];
	}
	draw(ctx){
		this.objects.forEach((object) => object.draw(ctx));
		if(this.paused){
			ctx.fillStyle = 'rgba(0,0,0,0.8)';
			ctx.fillRect(0,0,width,height);
			ctx.fillStyle = 'white';
			ctx.font = '40px Arial';
			ctx.textAlign = 'center';
			ctx.fillText('PAUSE', width/2, height/2);
		}
	}
	update(){
		if(height <= 700){
			this.paused = false;
		}
		if(!this.stop && !this.paused){
			for(let i = 0; i < this.obstacle.length; i++){
				if(this.obstacle[i].position.x + this.obstacle[i].w <= 0){
					this.obstacle[i].position.x = width;
				}
			}
			this.objects.forEach((object) => object.update(ctx));
		}
	}
	pause(){
		if(this.pauseTap){
			this.paused = false;
			this.pauseTap = false;
		}else{
			this.pauseTap = true;
			this.paused = true;
		}
	}
}

class Person{
	constructor(game){
		this.w = 96 - 30;
		this.h = 128;
		this.image = new Image();
		this.image.src = 'img/1.png';
		this.position = {
			x: 100 - 30,
			y: height - game.ground[0].h - this.h,
		};

		this.dy = 0;
		this.dymax = 40;
		this.jump = false;
		this.canjump = true;

		this.chance = 0;
		this.persent = 0;

		this.gravitation = this.dymax/2;
	}
	update(){
		this.chance ++;
		this.persent = this.chance%49;

		if(this.persent >= 0 && this.persent < 7){
			this.image.src = 'img/1.png';
		}else 
		if(this.persent >= 7 && this.persent < 14){
			this.image.src = 'img/2.png';
		}else
		if(this.persent >= 14 && this.persent < 21){
			this.image.src = 'img/3.png';
		}else
		if(this.persent >= 21 && this.persent < 28){
			this.image.src = 'img/4.png';
		}else
		if(this.persent >= 28 && this.persent < 35){
			this.image.src = 'img/5.png';
		}else
		if(this.persent >= 35 && this.persent < 42){
			this.image.src = 'img/6.png';
		}else
		if(this.persent >= 42 && this.persent < 49){
			this.image.src = 'img/7.png';
		}

		this.position.y += this.gravitation;

		if(this.jump){
			this.position.y -= this.dy;
			this.dy -= 1;
			this.canjump = false;
			if(this.dy > 0){
				this.jump = true;
			}else{
				this.jump = false;
			}
		}

		for(let i = 0; i < game.obstacle.length; i++){
			if(touchTop(this, game.obstacle[i]) || touchRight(this, game.obstacle[i]) || touchTop(this, game.obstacle[i])){
				game.stop = true;
			}
		}

		if(this.position.y + this.h >= game.ground[0].position.y){
			this.position.y = game.ground[0].position.y - this.h;
			this.canjump = true;
		}
	}
	draw(ctx){
		ctx.drawImage(this.image, this.position.x- 30, this.position.y, this.w + 30, this.h);
	}
	jumpBoost(){
		if(this.canjump){
			this.dy = this.dymax;
			this.jump = true;
		}
	}
}

class Key{
	constructor(game){
		document.addEventListener('keydown', (e) => {
			switch(e.keyCode){
				case 32:
					game.person.jumpBoost();
					break;
				case 27:
					game.pause();
					break;
			}
		});
		document.addEventListener('click', function(){
			game.person.jumpBoost();
		});
	}
}

class Ground{
	constructor(game, position){
		this.image = new Image();
		this.image.src = 'img/ground.png';
		this.w = 210;
		this.h = 146;
		this.position = position;
	}
	draw(ctx){
		ctx.drawImage(this.image, this.position.x, this.position.y, this.w, this.h);
	}
	update(){
		this.position.x -= game.obstacle[0].speed;
		for(let i = 0; i < game.ground.length; i++){
			if(game.ground[i].position.x <= 0 - this.w){
				game.ground[i].position.x = width;
			}
		}
	}
}

class Obstacle{
	constructor(game, position){
		this.w = 40;
		this.h = 56;
		this.image = new Image();
		this.image.src = 'img/saw.png';
		this.position = position;
		this.speedAdd = 0.003;
		this.speed = 4;
		this.maxSpeed = 11;
	}
	draw(ctx){
		ctx.drawImage(this.image, this.position.x, this.position.y, this.w, this.h);
	}
	update(){
		if(this.speed <= this.maxSpeed){
			this.speed += this.speedAdd;
		}
		this.position.x -= this.speed; 
	}
}
class Cloud1{
	constructor(game){
		this.w = 228;
		this.h = 124;
		this.image = new Image();
		this.image.src = 'img/cloud4.png';
		this.position = {
			x: 70,
			y: 40,
		};
	}
	draw(ctx){
		ctx.drawImage(this.image, this.position.x, this.position.y, this.w, this.h);
	}
	update(){
		this.position.x -= 1.3;
		if(this.position.x + this.w <= 0){
			this.position.x = width;
		}
	}
}
class Cloud2{
	constructor(game){
		this.w = 228;
		this.h = 124;
		this.image = new Image();
		this.image.src = 'img/cloud4.png';
		this.position = {
			x: 260,
			y: 90,
		};
	}
	draw(ctx){
		ctx.drawImage(this.image, this.position.x, this.position.y, this.w, this.h);
	}
	update(){
		this.position.x -= 1.2;
		if(this.position.x + this.w <= 0){
			this.position.x = width;
		}
	}
}
class Cloud3{
	constructor(game){
		this.w = 234;
		this.h = 118;
		this.image = new Image();
		this.image.src = 'img/cloud7.png';
		this.position = {
			x: width - 200,
			y: 140,
		};
	}
	draw(ctx){
		ctx.drawImage(this.image, this.position.x, this.position.y, this.w, this.h);
	}
	update(){
		this.position.x -= 1.3;
		if(this.position.x + this.w <= 0){
			this.position.x = width;
		}
	}
}
class Cloud4{
	constructor(game){
		this.w = 213;
		this.h = 119;
		this.image = new Image();
		this.image.src = 'img/cloud9.png';
		this.position = {
			x: width/2,
			y: 40,
		};
	}
	draw(ctx){
		ctx.drawImage(this.image, this.position.x, this.position.y, this.w, this.h);
	}
	update(){
		this.position.x -= 1.4;
		if(this.position.x + this.w <= 0){
			this.position.x = width;
		}
	}
}

let game = new Game(width, height);
game.start();

function Loop(){
	ctx.clearRect(0,0,width,height);
	game.update();
	game.draw(ctx);

	requestAnimationFrame(Loop);
}
Loop();