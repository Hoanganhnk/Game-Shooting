const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ship = { x: 400, y: 550, width: 50, height: 50 };
let bullets = [];
let enemies = [];
let keys = {};
let score = 0;

const shootSound = document.getElementById('shootSound');
shootSound.playbackRate = 2.0; // Tăng tốc độ phát lên 2x

let lastShotTime = 0;
let shotDelay = 50; // Giảm độ trễ để bắn nhanh hơn

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function drawShip() {
  ctx.fillStyle = 'white';
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}

function drawBullets() {
  ctx.fillStyle = 'red';
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    bullet.y -= 5;
  });
}

function drawEnemies() {
  ctx.fillStyle = 'green';
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.y += 2;
  });
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 20);
}

function update() {
  let currentTime = new Date().getTime();

  if (keys['ArrowLeft'] && ship.x > 0) ship.x -= 5;
  if (keys['ArrowRight'] && ship.x < canvas.width - ship.width) ship.x += 5;

  if (keys[' '] && currentTime - lastShotTime > shotDelay) {
    bullets.push({ x: ship.x + ship.width / 2 - 2.5, y: ship.y, width: 5, height: 10 });
    shootSound.play();
    lastShotTime = currentTime;
  }

  bullets = bullets.filter(bullet => bullet.y > 0);
  enemies = enemies.filter(enemy => enemy.y < canvas.height);

  if (Math.random() < 0.02) {
    enemies.push({ x: Math.random() * (canvas.width - 50), y: 0, width: 50, height: 50 });
  }

  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y) {
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
      }
    });
  });
}

function checkGameOver() {
  enemies.forEach(enemy => {
    if (enemy.y + enemy.height > ship.y) {
      alert('Game Over! Your score: ' + score);
      document.location.reload();
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShip();
  drawBullets();
  drawEnemies();
  drawScore();
  update();
  checkGameOver();
  requestAnimationFrame(gameLoop);
}

gameLoop();

