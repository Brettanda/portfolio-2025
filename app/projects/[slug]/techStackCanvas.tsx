"use client"

import Matter from "matter-js";
import { useEffect, useRef } from "react";
import { faWordpress, faElementor, faYoast } from "@fortawesome/free-brands-svg-icons";
import { icon, IconDefinition } from "@fortawesome/fontawesome-svg-core";

import "./pathseg.js";

type Tech = {
  name: string;
  icon: IconDefinition
  iconColour: string
}

const techList: Tech[] = [
  { name: "WordPress", icon: faWordpress, iconColour: "#444140" },
  { name: "Elementor", icon: faElementor, iconColour: "#FF7BE5" },
  { name: "YoastSEO", icon: faYoast, iconColour: "#A61E69" }
];

type Paths = {
  path: Path2D
  iconColour: string
}

export default function TechStackCanvas({ technologies }: { technologies: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth / 2;

    const engine = Matter.Engine.create();
    const world = engine.world;

    // const render = Matter.Render.create({
    // canvas,
    // engine,
    // options: {
    // width: window.innerWidth / 2,
    // height: window.innerHeight,
    // wireframes: false,
    // background: "#00000000",
    // }
    // });

    const walls = [
      Matter.Bodies.rectangle(canvas.width / 2, canvas.height + 25, canvas.width, 50, { isStatic: true }), // floor
      Matter.Bodies.rectangle(-25, canvas.height / 2, 50, canvas.height, { isStatic: true }), //left
      Matter.Bodies.rectangle(canvas.width + 25, canvas.height / 2, 50, canvas.height, { isStatic: true }) //right
    ]
    Matter.World.add(world, walls);

    // const iconImages = techList.map((tech) => {
    // const svgHTML = icon(tech.icon).html[0];
    // const svgBlob = new Blob([svgHTML], { type: "image/svg+xml;charset=utf-8" });
    // const url = URL.createObjectURL(svgBlob);
    // const img = new Image();
    // img.src = url;
    // return img;
    // });
    const bodies: Matter.Body[] = [];
    const paths: Paths[] = [];

    techList.map((tech, i) => {
      const svgHtml = icon(tech.icon).html[0];
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgHtml, "image/svg+xml");
      const pathElements = svgDoc.querySelectorAll("path");

      // const verticesArrays: Matter.Vector[][] = [];

      const path2d = new Path2D();
      pathElements.forEach((p) => path2d.addPath(new Path2D(p.getAttribute("d") || "")));
      paths.push({ path: path2d, iconColour: tech.iconColour });
      // paths.forEach((path) => {
      // try {
      // const verts = Matter.Svg.pathToVertices(path, 15);
      // verticesArrays.push(verts);
      // } catch (e) {
      // console.warn("Failed to convert SVG path:", e);
      // }
      // })

      const radius = 90 + Math.random() * (canvas.width / 5) - (techList.length * 10);
      const body = Matter.Bodies.circle(200 + i * 200, 100, radius, {
        restitution: 0.2,
        friction: 0.1,
        // render: {
        // fillStyle: "#ff0fff"
        // }
      });

      if (body) bodies.push(body);
      // const radius = 40 + Math.random() * 40;
      // return Matter.Bodies.circle(
      // 100 + i * 50,
      // 50,
      // radius,
      // { restitution: 0.7, friction: 0.1 }
      // )
    })
    // Matter.World.add(world, balls);
    Matter.World.add(world, bodies);

    const mouse = Matter.Mouse.create(canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: true }
      }
    })
    Matter.World.add(world, mouseConstraint);
    // Matter.Render.run(render);
    const render = () => {
      Matter.Engine.update(engine, 1000 / 60);
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bodies.forEach((ball, i) => {
        const { x, y } = ball.position;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(ball.angle);

        const radius = ball.circleRadius || 40;
        // const ballball = techList.find((b) => b.name == ball.)
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = paths[i].iconColour;
        ctx.fill();
        // ctx.strokeStyle = "#00ffff";
        // ctx.lineWidth = 2;
        // ctx.stroke();
        ctx.closePath();

        const scale = 0.3 * radius / 100;
        ctx.scale(scale, scale);
        ctx.translate(-256, -256);
        ctx.fillStyle = "#ffffff";
        ctx.fill(paths[i].path)
        ctx.restore();
      })
      requestAnimationFrame(render)
    }
    render();

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return () => {
      // Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      canvas.remove();
    }
  }, [technologies])

  return (
    <canvas ref={canvasRef} className="backface" id="backface"></canvas>
  )
};
