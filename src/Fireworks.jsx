import React, { useEffect, useRef } from "react";

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function Fireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function createBurst(x, y) {
      const count = 30 + Math.floor(Math.random() * 40);
      const colors = ["#ffdd57", "#ff6b6b", "#ffd166", "#8ecae6", "#c77dff"];
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: Math.cos(Math.random() * 2 * Math.PI) * random(1, 6),
          vy: Math.sin(Math.random() * 2 * Math.PI) * random(1, 6),
          age: 0,
          life: random(40, 120),
          color: colors[Math.floor(Math.random() * colors.length)],
          size: random(1, 3),
        });
      }
    }

    function loop() {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age++;
        p.vy += 0.02;
        p.x += p.vx;
        p.y += p.vy;

        const alpha = 1 - p.age / p.life;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.age >= p.life) particles.splice(i, 1);
      }

      requestAnimationFrame(loop);
    }

    const interval = setInterval(() => {
      createBurst(random(100, canvas.width - 100), random(50, canvas.height / 2));
    }, 800);

    canvas.addEventListener("click", (e) => createBurst(e.clientX, e.clientY));

    loop();

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(interval);
    };
  }, []);

  return <canvas ref={canvasRef} className="fireworks-canvas fixed top-0 left-0 w-full h-full pointer-events-none z-30" />;
}
