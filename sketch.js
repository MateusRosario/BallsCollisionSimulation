/*
Animação de colisão de bolas com efeito gravitacional
*/

let w;
let h;
// Raio máximo e mínimo das bolas
const r_max = 10;
const r_min = 10;
// Velocidade Inicial máxima
const vel_ini_max = 5;
// Número de bolas iniciais
const num = 30;
// Aceleração da gravidade causada pelo mouse
const agMouse = 50;
// Posicionar bolas iniciais
const start_ini_bolls = true;
// Efeito da gravidade das bolas
const grav_bolls = true;

var balls = [];

function Ball(id, x, y, r, sx, sy){
	this.id = id;
	this.positionx = x;
	this.positiony = y;
	this.positionx_bef = null;
	this.positiony_bef = null;
	this.r = r;
	this.speedx = sx;
	this.speedy = sy;
	this.red = rand(100, 200);
	this.green = rand(100, 200);
	this.blue = rand(100, 200);
	this.ativa = true;

	this.draw = function(){
		fill(this.red, this.green, this.blue);
		ellipse(this.positionx, this.positiony, this.r*2, this.r*2);
	};

	this.move = function(){
		this.positionx_bef = this.positionx;
		this.positiony_bef = this.positiony;

		this.positionx = this.positionx + this.speedx;
		this.positiony = this.positiony + this.speedy;
		
		if(this.positiony > h - this.r){
			this.speedy *= -1;
			this.positiony = h - this.r;
	 	}else if(this.positiony < this.r){
			this.speedy *= -1;
			this.positiony = this.r;
		}

		if(this.positionx > w - this.r){
			this.speedx *= -1;
			this.positionx = w - this.r;
	 	}else if(this.positionx < this.r){
			this.speedx *= -1;
			this.positionx = this.r
		}
	};

	this.verify_colision = function (balls) {
		perda_energia = 1;
		desativarBall = true;
		for(i = 0; i < balls.length; i = i + 1){
			if(i != this.id){
				var dist = Math.sqrt(Math.pow(this.positionx - balls[i].positionx,2) + Math.pow(this.positiony - balls[i].positiony,2));
				if(dist < 1000){
					desativarBall = false;
				}
				if( dist < (this.r + balls[i].r)){
					// y_temp = this.speedy;
					// x_temp = this.speedx;

					// this.speedy = perdaEnergia(balls[i].speedy, perda_energia);
					// this.speedx = perdaEnergia(balls[i].speedx, perda_energia);
					//
					// balls[i].speedy = perdaEnergia(y_temp, perda_energia);
					// balls[i].speedx = perdaEnergia(x_temp, perda_energia);

					[this.speedy, balls[i].speedy] = resultCollision(this.speedy, this.r, balls[i].speedy, balls[i].r);
					[this.speedx, balls[i].speedx] = resultCollision(this.speedx, this.r, balls[i].speedx, balls[i].r);


					this.move();
					balls[i].move()
				}else{
					if(grav_bolls){
						gravity(balls[i], this.positionx, this.positiony, this.r);
					}
				}
			}
		}
		this.ativa = !desativarBall;
	};
}

function rand(i,j){
	return (Math.random()*(j-i)) + i
}

function setup() {
	createCanvas(window.innerWidth - 20, window.innerHeight - 20);
	w = window.innerWidth - 20
	h = window.innerHeight - 20
	if(start_ini_bolls){
		for(i = 0; i < num; i++){
			//Coloca as bolas iniciais
			balls.push(new Ball(i, rand(r_max, w-r_max), rand(r_max, h-r_max), rand(r_min, r_max), rand(-vel_ini_max, vel_ini_max), rand(-vel_ini_max, vel_ini_max)))
		}
	}
}

// Desenha bolas
function draw() {
	background(0);

	if(mouseIsPressed){
		for(c = 0; c < balls.length ; c++){
			if(balls[c].ativa){
				gravity(balls[c], mouseX, mouseY, agMouse, true)
			}
		}
	}

	for(i = 0; i < balls.length ; i++){
		if(balls[i].ativa){
			balls[i].draw();
			balls[i].move();
		}
	}

	for(b = 0; b < balls.length ; b++){
		if(balls[b].ativa){
			balls[b].verify_colision(balls);
		}
	}
}

function keyPressed() {
	//Spawn bollas se tecla ctrl é pressionada
	if (keyCode === CONTROL) {
		balls.push(new Ball(balls.length, mouseX, mouseY, rand(r_min, r_max), 0, 0))
	}
}

// Calcula influencia da gravidade na velocidade das bolas
function gravity(ball, massX, massY, ag, mouse = false) {
	var dist = Math.sqrt(Math.pow(massX - ball.positionx,2) + Math.pow(massY - ball.positiony,2));

	if(!mouse || dist > r_min){
		//console.log(dist);
		var f = (ball.r * ag) /(dist*dist);

		ball.speedx = (massX > ball.positionx)? ball.speedx + f: (massX < ball.positionx)? ball.speedx - f : ball.speedx ;
		ball.speedy = (massY > ball.positiony)? ball.speedy + f: (massY < ball.positiony)? ball.speedy - f : ball.speedy ;
	}else{
		ball.speedx = 0
		ball.speedy = 0
	}
}

function perdaEnergia(velocidade, perda){
	if(velocidade > 0){
		velocidade = velocidade - perda;
		return velocidade > 0? velocidade: 0;
	}else if(velocidade < 0){
		velocidade = velocidade + perda;
		return velocidade < 0? velocidade: 0;
	}else{
		return 0;
	}
}

// Calcula resultado final das colisões
function resultCollision(velocity1, mass1, velocity2, mass2){
	let mommentum = mass1*velocity1 + mass2*velocity2;
	let velocity1F = (mommentum + mass2*(velocity2-velocity1)) / (mass1+mass2);
	let velocity2F = velocity1 + velocity1F - velocity2;
	// console.log('VelocidadeF1', velocity1F)
	// console.log('VelocidadeF2', velocity2F)
	// console.log('Mommentum concervado?', mommentum, mass1*velocity1F + mass2*velocity2F, mommentum === (mass1*velocity1F + mass2*velocity2F));

	return [velocity1F, -velocity2F];
}