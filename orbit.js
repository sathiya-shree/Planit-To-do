const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Star object constructor
function Star() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.radius = Math.random() * 1.5 + 0.5;
  this.opacity = Math.random();
  this.opacityDirection = Math.random() > 0.5 ? 1 : -1;
  this.speed = Math.random() * 0.3 + 0.1;
}

const stars = Array.from({ length: 150 }, () => new Star());

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    // Twinkle by changing opacity
    star.opacity += star.opacityDirection * 0.01;
    if (star.opacity <= 0 || star.opacity >= 1) {
      star.opacityDirection *= -1;
    }

    // Slow drifting
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
    ctx.shadowColor = "#00f7ff";
    ctx.shadowBlur = 5;
    ctx.fill();
  });

  requestAnimationFrame(drawStars);
}

drawStars();
