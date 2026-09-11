import React, { useEffect, useRef } from 'react';

const frameGlob = import.meta.glob('../../assets/frame_1/*.jpg', { eager: true });
const frameUrls = Object.values(frameGlob).map(mod => mod.default || mod);

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 3 + 1.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5 - 0.2;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.glow = Math.random() * 15 + 5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = this.canvasWidth;
    if (this.x > this.canvasWidth) this.x = 0;
    if (this.y < 0) this.y = this.canvasHeight;
    if (this.y > this.canvasHeight) this.y = 0;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6b00';
    ctx.shadowBlur = this.glow;
    ctx.shadowColor = '#ff6b00';
    ctx.fill();
    ctx.restore();
  }
}

const PremiumCapabilities = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (frameUrls.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let images = [];

    frameUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      images[index] = img;
    });

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    let currentFrame = 0;
    let animationId;
    let lastDrawTime = 0;

    const fps = 24;
    const interval = 1000 / fps;

    const playAnimation = (timestamp) => {
      if (!lastDrawTime) lastDrawTime = timestamp;

      const elapsed = timestamp - lastDrawTime;

      if (elapsed > interval) {
        lastDrawTime = timestamp - (elapsed % interval);

        let img = images[currentFrame];

        if (img && img.complete && img.naturalWidth !== 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width / 2) - (img.width / 2) * scale;
          const y = (canvas.height / 2) - (img.height / 2) * scale;

          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }

        particles.forEach(p => {
          p.update();
          p.draw(ctx);
        });

        currentFrame++;

        if (currentFrame >= images.length) {
          currentFrame = 0;
        }
      }

      animationId = requestAnimationFrame(playAnimation);
    };

    // Start immediately
    animationId = requestAnimationFrame(playAnimation);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section id="premium" className="relative w-full h-dvh bg-[#0a0a0c] overflow-hidden flex flex-col justify-center">
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="absolute top-0 left-0 w-full h-full object-cover"
      ></canvas>

      {/* Dark gradient overlay to make text pop more like the reference */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-[5]"></div>

      <div className="relative z-10 flex flex-col items-start justify-center px-8 md:px-24 w-full h-full max-w-7xl mx-auto">
        <div className="flex flex-col items-start max-w-xl">
          <span className="text-[#ff6b00] font-bold text-xs md:text-sm tracking-widest uppercase mb-4">
            Premium Capabilities
          </span>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 drop-shadow-lg">
            Engineering<br />
            Steel<br />
            Solutions
          </h2>

          <p className="text-gray-300 text-sm md:text-base font-light max-w-md mb-10 leading-relaxed">
            Lorem ipsum stoley and solutions, anat secone and theodive winning. scoluits and nodroging nower enchering original traners.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-[#ff6b00] hover:bg-[#ff8533] text-white text-sm font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-[0_0_20px_rgba(255,107,0,0.4)]">
              LEARN MORE
            </button>
            <button className="bg-transparent border border-white/40 hover:border-white text-white text-sm font-semibold py-3 px-8 rounded-full transition-colors duration-300 backdrop-blur-sm">
              LEAT MORE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumCapabilities;
