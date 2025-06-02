const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const centerX = () => canvas.width / 2;
const centerY = () => canvas.height / 2;

class OrbitingStar {
  constructor(radius, speed, size, color) {
    this.orbitRadius = radius;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = speed;
    this.size = size;
    this.color = color;
  }

  update() {
    this.angle += this.speed;
    const x = centerX() + this.orbitRadius * Math.cos(this.angle);
    const y = centerY() + this.orbitRadius * Math.sin(this.angle);

    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fill();
  }
}

const orbitingStars = [
  new OrbitingStar(40, 0.015, 2, "#ffffff"),
  new OrbitingStar(80, 0.01, 2.5, "#80dfff"),
  new OrbitingStar(120, 0.007, 3, "#66ccff"),
  new OrbitingStar(160, 0.005, 2, "#00f7ff"),
  new OrbitingStar(200, 0.003, 2.5, "#aadfff")
];

function animate() {
  ctx.fillStyle = "rgba(0, 0, 20, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  orbitingStars.forEach(star => star.update());

  requestAnimationFrame(animate);
}

animate();
