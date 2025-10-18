import React, { useEffect, useState, useRef } from "react";
import "./index.css";

// Fireworks Canvas Component
function FireworksCanvas() {
  const canvasRef = useRef(null);
  const random = (min, max) => Math.random() * (max - min) + min;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createBurst = (x, y) => {
      const count = 40;
      const colors = ["#ffdd57", "#ff6b6b", "#ffd166", "#8ecae6", "#c77dff"];
      const boom = new Audio("/boom.mp3"); // 💥 add explosion sound
      boom.volume = 0.3;
      boom.play();

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
    };

    const loop = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter((p) => p.age < p.life);
      for (const p of particles) {
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
      }

      requestAnimationFrame(loop);
    };

    const interval = setInterval(() => {
      createBurst(random(100, canvas.width - 100), random(50, canvas.height / 2));
    }, 1500);

    canvas.addEventListener("click", (e) => createBurst(e.clientX, e.clientY));
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(interval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-20"
    />
  );
}

// Main App
export default function App() {
  const [rockets, setRockets] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);

  const backgroundImages = [
    "/images/diya_small.jpg",
    "/images/chhoti.jpg",
    "/images/govardhan.jpg",
  ];

  const diyaCount = 5;

  // 🚀 Rocket launch + explosion
  const launchRocket = () => {
    const id = Date.now() + Math.random();
    const x = Math.random() * window.innerWidth;
    const rocketSound = new Audio("/diwali_theme.mp3");
    rocketSound.volume = 0.2;
    rocketSound.play();

    setRockets((r) => [...r, { id, x, y: window.innerHeight - 50, vy: -8 }]);
  };

  useEffect(() => {
    const rocketInterval = setInterval(() => launchRocket(), 3000);

    const moveInterval = setInterval(() => {
      setRockets((prev) =>
        prev
          .map((r) => ({ ...r, y: r.y + r.vy }))
          .filter((r) => {
            if (r.y < 200) {
              const audio = new Audio("/boom.mp3");
              audio.volume = 0.3;
              audio.play();
              return false;
            }
            return true;
          })
      );
    }, 30);

    const bgInterval = setInterval(() => {
      setBgIndex((i) => (i + 1) % backgroundImages.length);
    }, 5000);

    return () => {
      clearInterval(rocketInterval);
      clearInterval(moveInterval);
      clearInterval(bgInterval);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col items-center justify-center">
      {/* 🔄 Background Slider */}
      {backgroundImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-2000 ${
            index === bgIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

      {/* Fireworks Canvas */}
      <FireworksCanvas />

      {/* Background Music */}
      <audio src="/diwali_theme.mp3" autoPlay loop />

      {/* 🪔 Diwali Wishes */}
      {/* Diwali Heading (Bouncing only) */}
      {/* Bouncing Happy Diwali Text */}
      <div className="md:absolute top-1/5 w-full text-center z-40 px-4 sm:px-6 md:px-8 animate-bounce">
        <h1 className="glowing-text text-3xl sm:text-6xl md:text-7xl sm:mt30 font-extrabold">
          🪔✨Happy Diwali!✨🪔
        </h1>
      </div>

      {/* Fixed Message and Signature Below */}
      <div className="md:absolute top-[55%] w-full text-center z-40 px-4 sm:px-6 md:px-8">
        <p className="mt-4 text-white text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
          May this Diwali fill your life with brightness, joy, and endless smiles.<br />
          Let’s celebrate with love, laughter, and light all around.<br />
          Wishing you peace, prosperity, and happiness always.
        </p>
        <p className="mt-4 text-yellow-300 text-xl sm:text-2xl font-semibold drop-shadow-lg">
          🪔 Sujay Bote
        </p>
        <p className="mt-6 text-red-900 text-xl sm:text-xl md:text-xl lg:text-2xl font-bold drop-shadow-md animate-pulse">
        Happy Diwali 🪔 May your code always run, and your bugs always burn 🔥
      </p>
      </div>



      {/* 🚀 Rockets */}
      {rockets.map((r) => (
        <div
          key={r.id}
          className="absolute w-2 h-6 bg-gradient-to-t from-yellow-400 to-red-600 rounded-full z-30"
          style={{
            left: r.x,
            top: r.y,
            boxShadow: "0 0 20px yellow, 0 0 40px orange",
          }}
        />
      ))}

      {/* 🪔 Diyas */}
      <div className="absolute bottom-6 flex justify-center w-full z-30 space-x-4">
        {Array.from({ length: diyaCount }).map((_, i) => (
          <div key={i} className="diya w-5 h-5 animate-pulse">
            <div className="flame w-3 h-5 bg-yellow-400 rounded-full animate-flicker"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
