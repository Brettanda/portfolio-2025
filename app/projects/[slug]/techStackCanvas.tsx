"use client"

import { useEffect, useRef } from "react";

const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Circle {
  name: string;
  constructor(name: string) { this.name = name; }
}
type Position = {
  x: number
  y: number
  s: number
  spdx: number
  spdy: number
  gravSpd: number
  bounce: number
  hue: number
  gravity: number
}

export default function TechStackCanvas({ technologies }: { technologies: Array<string> }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  const count = technologies.length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    context.canvas.width = window.innerWidth / 2;
    context.canvas.height = window.innerHeight;

    const Pos: Array<Position> = [],
      vel = 0;

    for (var i = 0; i < count; i++) {
      var randS = getRandom(40, 80),
        randX = getRandom(canvas.width - randS, 1 + randS),
        randY = getRandom(canvas.height - randS, 1 + randS),
        spdX = 0,
        spdY = 0,
        gravity = getRandom(5, 10) / 10,
        gravSpd = 0,
        bounce = 1,
        hue = getRandom(1, 255);
      Pos.push({ x: randX, y: randY, s: randS, spdx: spdX, spdy: spdY, gravSpd: gravSpd, bounce: bounce, hue: hue, gravity: gravity })
    }
    const draw = (time: number) => {
      context.clearRect(0, 0, canvas.width, canvas.height)

      for (var i = 0; i < Pos.length; i++) {
        context.beginPath();
        context.fillStyle = `hsla(${Pos[i].hue},100%,50%,0.5)`;
        context.arc(Pos[i].x, Pos[i].y, Pos[i].s, 0, 2 * Math.PI)
        context.fill();
        context.closePath();

        Pos[i].gravSpd += Pos[i].gravity;
        Pos[i].x += Pos[i].spdx;
        Pos[i].y += Pos[i].spdy + Pos[i].gravSpd;

        const hitBottom = () => {
          let rockBottom = canvas.height - Pos[i].s;

          if (Pos[i].y >= rockBottom) {
            Pos[i].y = rockBottom;
            Pos[i].gravSpd = -(Pos[i].gravSpd * Pos[i].bounce)
          }
        }
        hitBottom();
      }
      requestRef.current = requestAnimationFrame(draw)
    }

    requestRef.current = requestAnimationFrame(draw)

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="backface" id="backface"></canvas>
  )
};
