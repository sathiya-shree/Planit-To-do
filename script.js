const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 80;
const maxVelocity = 0.5;
const particleRadius = 3;

let bgGradientLight, bgGradientDark;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  // Create gradients for light and dark modes
  bgGradientLight = ctx.createLinearGradient(0, 0, width, height);
  bgGradientLight.addColorStop(0, '#74ebd5');
  bgGradientLight.addColorStop(1, '#ACB6E5');

  bgGradientDark = ctx.createLinearGradient(0, 0, width, height);
  bgGradientDark.addColorStop(0, '#0f2027');
  bgGradientDark.addColorStop(0.5, '#203a43');
  bgGradientDark.addColorStop(1, '#2c5364');
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() * 2 - 1) * maxVelocity;
    this.vy = (Math.random() * 2 - 1) * maxVelocity;
    this.radius = particleRadius;
    this.color = 'rgba(0,0,0,0.3)'; // will update dynamically
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < this.radius || this.x > width - this.radius) this.vx *= -1;
    if (this.y < this.radius || this.y > height - this.radius) this.vy *= -1;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouse.radius - dist) / mouse.radius;
        this.vx += Math.cos(angle) * force * 0.5;
        this.vy += Math.sin(angle) * force * 0.5;
        this.vx = Math.min(Math.max(this.vx, -maxVelocity), maxVelocity);
        this.vy = Math.min(Math.max(this.vy, -maxVelocity), maxVelocity);
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color.replace(/0\.3|0\.7/, '0.5'); // shadow with opacity 0.5
    ctx.shadowBlur = 8;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}
initParticles();

const mouse = { x: null, y: null, radius: 100 };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

function animateParticles() {
  const isDark = document.body.classList.contains('dark-mode');

  // Set background gradient based on mode
  ctx.fillStyle = isDark ? bgGradientDark : bgGradientLight;
  ctx.fillRect(0, 0, width, height);

  // Set particle and line colors
  const particleColor = isDark
    ? 'rgba(255, 255, 255, 0.7)'
    : 'rgba(0, 0, 0, 0.3)';

  const lineColorBase = isDark ? '255,255,255' : '0,0,0';

  // Update and draw particles
  for (let i = 0; i < particleCount; i++) {
    const p1 = particles[i];
    p1.color = particleColor;
    p1.update();
    p1.draw();

    // Draw lines to nearby particles
    for (let j = i + 1; j < particleCount; j++) {
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${lineColorBase},${1 - dist / 120})`;
        ctx.lineWidth = 1;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();

// Dark mode toggle button
const toggleBtn = document.getElementById('toggleDarkMode');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
});
