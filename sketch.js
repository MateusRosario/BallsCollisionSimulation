/*
Animação de colisão de bolas com efeito gravitacional
*/

let w;
let h;
// Raio máximo e mínimo das bolas
const r_max = 50;
const r_min = 20;
// Velocidade Inicial máxima
const vel_ini_max = 2;
// Número de bolas iniciais
const num = 30;
// Aceleração da gravidade causada pelo mouse
let mouseG = false;
const agMouse = 500;
// Posicionar bolas iniciais
const start_ini_bolls = true;
// Efeito da gravidade das bolas
const grav_bolls = true;

let showControls = false;

let xDrag = null;
let yDrag = null;

let balls = [];

let newBall = null;
let spowningBall = false;

let view = new SpaceView();

function SpaceView(){
	this.zoom = 0.25;
	this.x = 0;
	this.y = 0;

	this.resetPos = function (){
		this.zoom = 1;
		this.x = 0;
		this.y = 0;
	}

	this.drawCenter = function (){
		fill(255, 2, 0);
		ellipse(w/2, h/2, 3, 3);
	}

	this.transCoordinateX = function (coordinate){
		return w/2 + (coordinate*this.zoom) - this.x;
	}

	this.transCoordinateY = function (coordinate){
		return h/2 - (coordinate*this.zoom) + this.y;
	}

	this.revCoordinateX = function (coordinate){
		return -(w/2)/this.zoom + coordinate/this.zoom + this.x/this.zoom;
	}

	this.revCoordinateY = function (coordinate){
		return -((-h/2)/this.zoom + coordinate/this.zoom) + this.y/this.zoom;
	}

	this.transSize = function (size){
		return size * this.zoom;
	}

	this.zoomIn = function (x, y){
		this.zoom += this.zoom/10;
		x = this.posRelateViewX(x);
		y = this.posRelateViewY(y);
		this.x += x/2;
		this.y += y/2;
	}

	this.zoomOut = function (x, y){
		x = this.posRelateViewX(x);
		y = this.posRelateViewY(y);
		this.x += x/10;
		this.y += y/10;
		this.zoom -= this.zoom/10;
		if(this.zoom < 0.0001){
			this.zoom = 0.0001;
		}
	}

	this.posRelateViewX = function (coordinate){
		return coordinate - w/2;
	}

	this.posRelateViewY = function (coordinate){
		return -(coordinate - h/2);
	}

}

function Ball(id, x, y, r, sx, sy){
	this.id = id;
	this.positionx = x;
	this.positiony = y;
	this.r = r;
	this.speedx = sx;
	this.speedy = sy;
	this.red = rand(100, 200);
	this.green = rand(100, 200);
	this.blue = rand(100, 200);
	this.ativa = true;

	this.draw = function(){
		fill(this.red, this.green, this.blue);
		ellipse(view.transCoordinateX(this.positionx), view.transCoordinateY(this.positiony), view.transSize(this.r)*2,
			view.transSize(this.r)*2);
	};

	this.move = function(){

		this.positionx = this.positionx + this.speedx;
		this.positiony = this.positiony + this.speedy;
		
		// if(this.positiony > h - this.r){
		// 	this.speedy *= -1;
		// 	this.positiony = h - this.r;
	 	// }else if(this.positiony < this.r){
		// 	this.speedy *= -1;
		// 	this.positiony = this.r;
		// }
		//
		// if(this.positionx > w - this.r){
		// 	this.speedx *= -1;
		// 	this.positionx = w - this.r;
	 	// }else if(this.positionx < this.r){
		// 	this.speedx *= -1;
		// 	this.positionx = this.r
		// }
	};

	this.verify_colision = function (balls) {
		//let perda_energia = 1;
		let desativarBall = true;
		for(i = 0; i < balls.length; i = i + 1){
			if(i !== this.id){
				const dist = Math.sqrt(Math.pow(this.positionx - balls[i].positionx,2) + Math.pow(this.positiony - balls[i].positiony,2));
				if(dist < 100000){
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
	w = window.innerWidth - 25
	h = window.innerHeight - 25
	let cvn = createCanvas(w, h);
	if(start_ini_bolls){
		for(i = 0; i < num; i++){
			//Coloca as bolas iniciais
			balls.push(new Ball(i, rand(-w/2 + r_max, w/2 - r_max)/view.zoom, rand(-h/2 + r_max, h/2 - r_max)/view.zoom, rand(r_min, r_max), rand(-vel_ini_max, vel_ini_max), rand(-vel_ini_max, vel_ini_max)))
		}
	}
}

// Desenha bolas
function draw() {
	background(0);

	//view.drawCenter();

	//Aplicando gravidade do mouse, se botão SHIFT pressionado
	if(mouseG){
		for(c = 0; c < balls.length ; c++){
			if(balls[c].ativa){
				gravity(balls[c], view.revCoordinateX(mouseX), view.revCoordinateY(mouseY), agMouse, true)
			}
		}
	}

	for(let i = 0; i < balls.length ; i++){
		if(balls[i].ativa){
			balls[i].draw();
			balls[i].move();
		}
	}

	if(newBall != null){
		newBall.positionx = view.revCoordinateX(mouseX);
		newBall.positiony = view.revCoordinateY(mouseY);
		newBall.draw();
	}

	for(let b = 0; b < balls.length ; b++){
		if(balls[b].ativa){
			balls[b].verify_colision(balls);
		}
	}

	this.drawInfos(w - 320, 10, 0,
		'Bolas ativas: ' + balls.filter(ball => ball.ativa).length,
		'Zoom: ' + view.zoom.toFixed(4),
		'X: ' + view.x.toFixed(2) + ' Y: ' + view.y.toFixed(2),
		'Mouse on Space => X: ' + view.revCoordinateX(mouseX).toFixed(2) + ' Y: ' + view.revCoordinateY(mouseY).toFixed(2),
		'Mouse on View => X: ' + view.posRelateViewX(mouseX).toFixed(2) + ' Y: ' + view.posRelateViewY(mouseY).toFixed(2),
	)

	if(showControls){
		this.drawInfos((w/2) - 220, h - 200, 10,
		'Arrastar o Mouse:                               move pelo espaço',
			'Roda do mouse:                                 zoom in e zoom out ',
			'Pressionar SHIFT:                              ativa efeito de gravidade na direção do cursor',
			'Pressionar ALT:                                  posiciona nova bola no espaço',
			'Pressionar ALT + Roda do mouse:    redimencionar nova bola'
		)
	}else{
		this.drawInfos(5, 5, 0, 'Controles: pressione tecla C')
	}
}

function drawInfos(pos, altura, espacamento, ... strings){
	textSize(15);
	fill(255, 50, 50);
	strings.reverse().forEach(info => {
		text(info, pos, h - altura);
		altura += 15 + espacamento
	})
}

function keyPressed() {
	console.log(keyCode)
	//Spawn bollas se tecla ctrl é pressionada
	if (keyCode === ALT) {
		newBall = new Ball(balls.length, view.revCoordinateX(mouseX), view.revCoordinateY(mouseY), rand(r_min, r_max), 0, 0);
	}

	if (keyCode === SHIFT) {
		mouseG = true;
	}

	if (keyCode === 32) {
		view.resetPos();
	}

	if (keyCode === 67) {
		showControls = true;
	}
}

function keyReleased() {
	if (keyCode === SHIFT) {
		mouseG = false;
	}

	if (keyCode === ALT) {
		balls.push(newBall);
		newBall = null;
	}

	if (keyCode === 67) {
		showControls = false;
	}
}

function mouseWheel(event) {
	if(newBall == null){
		if (event.deltaY > 0) {
			view.zoomOut(mouseX, mouseY);
		}
		else {
			view.zoomIn(mouseX, mouseY);
		}
	}else{
		if (event.deltaY > 0) {
			newBall.r -= newBall.r/10;
		}
		else {
			newBall.r += newBall.r/10;
		}
	}
}

function mouseDragged(){
	if(xDrag != null && yDrag != null){
		view.x += -mouseX - xDrag;
		view.y += mouseY - yDrag;

		xDrag = -mouseX;
		yDrag = mouseY;
	}else{
		xDrag = -mouseX;
		yDrag = mouseY;
	}
}

function mouseReleased(){
	xDrag = null;
	yDrag = null;
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