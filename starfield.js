// starfield.js
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Star {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 1.1 + 0.3;
    this.alpha = Math.random() * 0.8 + 0.2;
  }
  draw() {
    ctx.beginPath();
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 8;
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ShootingStar {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height * 0.5; // upper half for shooting start
    this.len = Math.random() * 80 + 50;
    this.speed = Math.random() * 15 + 8;
    this.size = Math.random() * 1 + 0.5;
    this.angle = Math.PI / 4; // 45 degree shooting angle
    this.alpha = 0;
    this.fadeIn = true;
  }
  update() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
    if (this.fadeIn) {
      this.alpha += 0.03;
      if (this.alpha >= 1) this.fadeIn = false;
    } else {
      this.alpha -= 0.02;
      if (this.alpha <= 0) this.reset();
    }
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.shadowColor = 'white';
    ctx.shadowBlur = 15;
    ctx.lineWidth = this.size;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.len * Math.cos(this.angle), this.y - this.len * Math.sin(this.angle));
    ctx.stroke();
    ctx.restore();
  }
}

const stars = [];
const shootingStars = [];

function init() {
  for (let i = 0; i < 150; i++) {
    stars.push(new Star());
  }
  for (let i = 0; i < 3; i++) {
    shootingStars.push(new ShootingStar());
  }
}
init();

function animate() {
  // Dark background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, '#000011');
  bgGradient.addColorStop(1, '#000022');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  stars.forEach((star) => star.draw());
  shootingStars.forEach((shoot) => {
    shoot.update();
    shoot.draw();
  });

  requestAnimationFrame(animate);
}
animate();
