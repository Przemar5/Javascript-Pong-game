const canvas = document.querySelector('#canvas');

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 100

var c = canvas.getContext('2d')

const paddingBorderOffset = 50

//c.fillStyle = 'rgb(35,35,35)';
//c.fillRect(50,10,40,150)

//c.fillStyle = 'rgb(35,35,35)';
//c.fillRect(canvas.width - 90,10,40,150)


class Paddle
{	
	constructor(offset, width, height)
	{
		this.offset = offset
		this.width = width;
		this.height = height;
		
		this.init(offset, width, height)
	}
	
	init = () => {
		this.y = canvas.height / 2 - this.height / 2
		this.color = 'rgb(35,35,35)';
		this.speed = 0;
		
		this.update()
	}
	
	draw = () => {
		c.fillRect(this.offset, 
				   this.y, 
				   this.width, 
				   this.height)
	}
	
	update = () => {
		if (this.y <= 0) {
			this.y = 0;
			this.speed = 0;
		} 
		else if (this.y >= canvas.height - this.height) {
			this.y = canvas.height - this.height;
			this.speed = 0;
		}
		
		this.y += this.speed;
	}
}


class Player extends Paddle
{
	update = () => {
		if (this.y <= 0) {
			this.y = 0;
			this.speed = 0;
		} 
		else if (this.y >= canvas.height - this.height) {
			this.y = canvas.height - this.height;
			this.speed = 0;
		}
		
		this.setVelocity()
		this.y += this.speed;
		this.draw()
	}
	
	setVelocity = () => {
		if (keys['ArrowUp'])
			this.speed -= .5;
		
		if (keys['ArrowDown'])
			this.speed += .5;
	}
}


class Enemy extends Paddle
{
	update = () => {
		if (this.y <= 0) {
			this.y = 0;
			this.speed = 0;
		} 
		else if (this.y >= canvas.height - this.height) {
			this.y = canvas.height - this.height;
			this.speed = 0;
		}
		
		if (this.y > ball.y)
			this.speed--;
		else if (this.y + this.height < ball.y)
			this.speed++;
		
		//this.setVelocity()
		this.y += this.speed;
		this.draw()
	}
}

//console.log(Math.random())

class Ball
{
	constructor()
	{
		this.init()
	}
	
	init = () => {
		this.radius = 20;
		this.y = this.radius + Math.random() * (canvas.height - this.radius * 2)
		this.x = canvas.width / 2
		this.dx = -8
		this.dy = 8
	}
	
	draw = () => {
		c.beginPath()
		c.arc(this.x, 
			  this.y,
			  this.radius,
			  0,
			  2 * Math.PI,
			  false);
		c.fill()
	}
	
	update = () => {
		if (this.y <= player.y + player.height && 
			this.y >= player.y && 
			this.x - this.radius <= player.offset + player.width) {
				this.dx *= -1;
		}
		if (this.y <= enemy.y + enemy.height && 
			this.y >= enemy.y && 
			this.x + this.radius >= (enemy.offset)) {
				this.dx *= -1;
		}
		
		if (this.y <= 0) {
			this.y = 0;
			this.dy *= -1;
		} 
		else if (this.y >= canvas.height - this.radius) {
			this.y = canvas.height - this.radius;
			this.dy *= -1;
		}
		this.x += this.dx
		this.y += this.dy
		
		this.draw()
	}
}

class Game
{
	constructor()
	{
		c.font = '48px serif';
		c.textAlign = 'center'
  		c.fillText('Press enter to start', 
				   canvas.width / 2, 
				   canvas.height / 2);
	}
	
	check = () => {
		if (ball.x + ball.radius < 0) {
			this.gameStarted = false;
			this.winner = 1
			this.reset()
		}
		else if (ball.x - ball.radius > innerWidth) {
			this.gameStarted = false;
			this.winner = 2
			this.reset()
		}
	}
	
	start = () => {
		c.clearRect(0, 0, canvas.width, canvas.height)
		
		player.init()
		enemy.init()
		ball.init()
	}
	
	reset = (winner) => {
		c.clearRect(0, 0, canvas.width, canvas.height)
		
		if (this.winner == 1)
			c.fillText('Enemy is winner', 
					   canvas.width / 2, 
					   canvas.height / 2);
		
		else if (this.winner == 2)
			c.fillText('You are winner', 
					   canvas.width / 2, 
					   canvas.height / 2);
		
		c.fillText('Press enter to start again', 
				   canvas.width / 2, 
				   canvas.height / 2 + 60);
		
	}
	
	listen = () => {
		if (!this.gameStarted && keys['Enter']) {
			this.gameStarted = true
			
			this.start()
		}
	}
}

keys = new Array('Enter', 'ArrowUp', 'ArrowDown')

player = new Player(50, 40, 150)
enemy = new Enemy(canvas.width - 50 - 40, 40, 150)
ball = new Ball()
game = new Game()


window.addEventListener("keydown", function (e) {
	keys[e.key] = true;
	console.log(e.key)
});

window.addEventListener("keyup", function (e) {
	keys[e.key] = false;
});

/*
window.addEventListener('keydown', e => {
	//console.log(e.key)
	
	c.clearRect(0, 0, innerWidth, innerHeight)
	
	switch (e.key) {
			
		case 'ArrowUp':
			player.y -= player.speed;
			break;
			
		case 'ArrowDown':
			player.y += player.speed;
			break;
	}
	
	player.update()
})
*/


var animate = () => {
	requestAnimationFrame(animate)
	
	game.listen()
	
	if (game.gameStarted) {
		c.clearRect(0, 0, innerWidth, innerHeight)

		player.update()
		enemy.update()
		ball.update()
		game.check()
		//game.check()
	}
}

animate()