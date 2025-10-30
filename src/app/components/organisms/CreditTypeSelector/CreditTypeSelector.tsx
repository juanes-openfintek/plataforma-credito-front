'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CreditType {
  id: string;
  title: string;
  image: string;
  route: string;
  position: 'top' | 'bottom-left' | 'bottom-right';
  startPosition: { x: number; y: number };
}

const creditTypes: CreditType[] = [
  {
    id: 'consumo',
    title: 'Crédito de Consumo',
    image: '/images/bolsa-de-dinero.png',
    route: '/credito-consumo',
    position: 'top',
    startPosition: { x: -200, y: -100 },
  },
  {
    id: 'libranza',
    title: 'Crédito de Libranza',
    image: '/images/dinero.png',
    route: '/credito-consumo',
    position: 'bottom-left',
    startPosition: { x: -150, y: 200 },
  },
  {
    id: 'tarjeta',
    title: 'Tarjeta de Crédito',
    image: '/images/tarjeta-bancaria.png',
    route: '/credito-consumo',
    position: 'bottom-right',
    startPosition: { x: 300, y: 150 },
  },
];

const CreditTypeSelector: React.FC = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [coinsLoaded, setCoinsLoaded] = useState(false);

  useEffect(() => {
    // Trigger rolling animation on mount
    setTimeout(() => setCoinsLoaded(true), 100);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;

      constructor() {
        const canvasWidth = canvas?.width || window.innerWidth;
        const canvasHeight = canvas?.height || window.innerHeight;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.4 + 0.1;

        // Platform blue colors
        const colors = ['#01b8e5', '#0046a8', '#00d4ff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        const canvasWidth = canvas?.width || window.innerWidth;
        const canvasHeight = canvas?.height || window.innerHeight;

        if (this.x > canvasWidth) this.x = 0;
        if (this.x < 0) this.x = canvasWidth;
        if (this.y > canvasHeight) this.y = 0;
        if (this.y < 0) this.y = canvasHeight;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color.replace(')', `, ${this.opacity})`).replace('rgb', 'rgba').replace('#', 'rgba(') || `rgba(1, 184, 229, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleCoinClick = (credit: CreditType) => {
    setSelectedCoin(credit.id);
    setIsAnimating(true);

    // Navigate after animation completes (1.5 seconds)
    setTimeout(() => {
      router.push(credit.route);
    }, 1500);
  };

  const getPositionClasses = (position: string) => {
    switch (position) {
      case 'top':
        return 'col-span-2 mx-auto';
      case 'bottom-left':
        return 'col-start-1';
      case 'bottom-right':
        return 'col-start-2';
      default:
        return '';
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 overflow-hidden">
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 transition-all duration-1000 ${
        isAnimating ? 'opacity-0 scale-150' : 'opacity-100 scale-100'
      }`}>
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="text-gray-800">Elige tu línea de </span>
            <span className="bg-gradient-to-r from-[#01b8e5] to-[#0046a8] bg-clip-text text-transparent">
              crédito
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Encuentra la solución financiera perfecta para ti
          </p>
        </div>

        {/* Coins in Pyramid */}
        <div className="grid grid-cols-2 gap-12 max-w-5xl w-full px-4 mb-12">
          {creditTypes.map((credit, index) => {
            return (
              <div
                key={credit.id}
                onClick={() => handleCoinClick(credit)}
                className={`group relative cursor-pointer ${getPositionClasses(credit.position)} ${
                  selectedCoin === credit.id ? 'coin-selected' : ''
                }`}
                style={{
                  animation: selectedCoin === credit.id
                    ? 'enterCoin 1.5s ease-in forwards'
                    : coinsLoaded
                    ? `float ${3 + index * 0.3}s ease-in-out infinite`
                    : 'none',
                  animationDelay: selectedCoin === credit.id ? '0s' : `${index * 0.15}s`,
                  transform: !coinsLoaded ? `translate(${credit.startPosition.x}px, ${credit.startPosition.y}px) rotate(${credit.startPosition.x * 2}deg)` : 'none',
                  transition: coinsLoaded ? 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                  transitionDelay: `${index * 0.2}s`,
                }}
              >
                {/* Coin Container */}
                <div className="relative w-72 h-72 mx-auto perspective-1000">
                  {/* Ambient Glow */}
                  <div
                    className="absolute inset-0 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                    style={{ backgroundColor: '#01b8e5' }}
                  />

                  {/* 3D Coin Body */}
                  <div
                    className="coin-3d relative w-full h-full rounded-full flex flex-col items-center justify-center overflow-visible border-[12px] transition-all duration-500"
                    style={{
                      background: `
                        radial-gradient(circle at 35% 35%, #00d4ff, #01b8e5 40%, #0046a8 85%),
                        linear-gradient(145deg, #00d4ff 0%, #01b8e5 45%, #0046a8 100%)
                      `,
                      borderColor: '#003d8f',
                      boxShadow: `
                        0 30px 80px rgba(0, 70, 168, 0.5),
                        0 15px 40px rgba(1, 184, 229, 0.3),
                        inset -10px -10px 20px rgba(0, 61, 143, 0.6),
                        inset 10px 10px 20px rgba(0, 212, 255, 0.4),
                        inset 0 0 60px rgba(0, 212, 255, 0.15)
                      `,
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(20px)',
                    }}
                  >
                    {/* Coin Depth Rings - 3D Effect */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        boxShadow: `
                          inset 0 2px 4px rgba(255, 255, 255, 0.5),
                          inset 0 -2px 4px rgba(0, 61, 143, 0.6),
                          inset 10px 0 20px rgba(0, 212, 255, 0.3),
                          inset -10px 0 20px rgba(0, 70, 168, 0.4)
                        `,
                      }}
                    />

                    {/* Inner Ring Detail */}
                    <div
                      className="absolute inset-[20px] rounded-full border-4"
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        boxShadow: 'inset 0 0 20px rgba(0, 212, 255, 0.3)',
                      }}
                    />

                    {/* Top Shine/Reflection - appears on hover */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at 35% 35%, rgba(255, 255, 255, 0.7), transparent 55%)`,
                      }}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
                      {/* Image container */}
                      <div className="relative w-32 h-32 mb-4 transform group-hover:scale-110 transition-transform duration-500 flex items-center justify-center drop-shadow-2xl">
                        <Image
                          src={credit.image}
                          alt={credit.title}
                          width={128}
                          height={128}
                          className="object-contain filter drop-shadow-lg"
                          priority
                          style={{
                            filter: 'drop-shadow(0 6px 8px rgba(0, 0, 0, 0.4))',
                          }}
                        />
                      </div>

                      {/* Title Only - No Description */}
                      <h3
                        className="text-2xl font-bold text-center px-6"
                        style={{
                          color: '#fff',
                          textShadow: '2px 2px 6px rgba(0, 61, 143, 0.8), 0 0 20px rgba(0, 212, 255, 0.5)',
                        }}
                      >
                        {credit.title}
                      </h3>
                    </div>
                  </div>

                  {/* Coin Side Edge - 3D Thickness */}
                  <div
                    className="absolute top-[12px] bottom-[12px] left-0 right-0 rounded-full pointer-events-none"
                    style={{
                      background: `linear-gradient(90deg,
                        rgba(0, 61, 143, 0.9) 0%,
                        rgba(0, 70, 168, 0.95) 48%,
                        rgba(1, 184, 229, 0.3) 50%,
                        rgba(0, 70, 168, 0.95) 52%,
                        rgba(0, 61, 143, 0.9) 100%
                      )`,
                      transform: 'translateZ(-8px)',
                      boxShadow: '0 4px 8px rgba(0, 61, 143, 0.6)',
                      zIndex: -1,
                    }}
                  />

                  {/* Floating particles around coin */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full opacity-70"
                        style={{
                          width: '4px',
                          height: '4px',
                          backgroundColor: '#00d4ff',
                          top: `${15 + (i % 4) * 20}%`,
                          left: `${15 + Math.floor(i / 2) * 20}%`,
                          animation: `orbit-${i % 3} ${4 + i * 0.5}s ease-in-out infinite`,
                          animationDelay: `${index * 0.2 + i * 0.1}s`,
                          boxShadow: '0 0 6px #01b8e5',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Hover Indicator Badge */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                  <div
                    className="rounded-full px-6 py-2 shadow-lg font-semibold text-sm"
                    style={{
                      background: 'linear-gradient(135deg, #01b8e5, #0046a8)',
                      color: '#fff',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                      boxShadow: '0 4px 12px rgba(1, 184, 229, 0.5)',
                    }}
                  >
                    Solicitar ahora →
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer text */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-gray-600 text-lg font-medium">
            Aprobación en menos de 24 horas • Sin papeleos • 100% digital
          </p>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        .coin-3d {
          transform-style: preserve-3d;
        }

        .group:hover .coin-3d {
          transform: translateZ(30px) rotateY(25deg) rotateX(-10deg);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotateY(0deg);
          }
          50% {
            transform: translateY(-20px) rotateY(5deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes enterCoin {
          0% {
            transform: scale(1) translateY(0) rotateZ(0deg);
            opacity: 1;
            filter: blur(0);
          }
          50% {
            transform: scale(1.2) translateY(-50px) rotateZ(180deg);
            opacity: 1;
          }
          100% {
            transform: scale(150) translateY(0) rotateZ(360deg);
            opacity: 0;
            filter: blur(10px);
          }
        }

        @keyframes orbit-0 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(15px, -15px) scale(1.3);
          }
          50% {
            transform: translate(20px, 0) scale(1);
          }
          75% {
            transform: translate(15px, 15px) scale(0.8);
          }
        }

        @keyframes orbit-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(-15px, 15px) scale(0.8);
          }
          50% {
            transform: translate(-20px, 0) scale(1.3);
          }
          75% {
            transform: translate(-15px, -15px) scale(1);
          }
        }

        @keyframes orbit-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(18px, 8px) scale(1.2);
          }
          50% {
            transform: translate(0, 20px) scale(0.9);
          }
          75% {
            transform: translate(-18px, 8px) scale(1.2);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .coin-selected {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default CreditTypeSelector;
