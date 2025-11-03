"use client"

import Matter from "matter-js";
import { useEffect, useRef } from "react";
import { faWordpress, faElementor, faYoast } from "@fortawesome/free-brands-svg-icons";
import { icon, IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { platform } from "os";

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

export default function SkillCanvas({ className, technologies }: { className: string, technologies: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let prevCanvasWidth = canvas.width;
    let prevCanvasHeight = canvas.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const engine = Matter.Engine.create();
    const world = engine.world;

    const walls = [
      Matter.Bodies.rectangle(canvas.width / 2, canvas.height + 25, canvas.width, 50, { isStatic: true }), // floor
      Matter.Bodies.rectangle(-25, canvas.height / 2, 50, canvas.height, { isStatic: true }), //left
      Matter.Bodies.rectangle(canvas.width + 25, canvas.height / 2, 50, canvas.height, { isStatic: true }) //right
    ]
    Matter.World.add(world, walls);

    const platforms = [
      Matter.Bodies.rectangle(canvas.width / 2, canvas.height / 2, canvas.width / 2, 50, { isStatic: true, render: { fillStyle: "#ff0000ff", strokeStyle: "pink", lineWidth: 10 } })
    ]
    Matter.World.add(world, platforms)

    const bodies: Matter.Body[] = [];
    const paths: Paths[] = [];

    let radius = 60;
    if (techList.length < 5) radius = 40;
    techList.map((tech, i) => {
      const svgHtml = icon(tech.icon).html[0];
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgHtml, "image/svg+xml");
      const pathElements = svgDoc.querySelectorAll("path");


      const path2d = new Path2D();
      pathElements.forEach((p) => path2d.addPath(new Path2D(p.getAttribute("d") || "")));
      paths.push({ path: path2d, iconColour: tech.iconColour });

      const x_spacing = Math.floor(canvas.width / (radius * 2));
      const x = i % x_spacing * (radius * 2) + radius;
      const y = Math.floor(i / x_spacing) * (radius * 2) + radius;
      const body = Matter.Bodies.circle(x, y, radius, {
        restitution: 0.2,
        friction: 0.1,
      });

      if (body) bodies.push(body);
    })

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

    // yoinked from https://github.com/liabru/matter-js/issues/929#issuecomment-2251873788
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      canvas.style.pointerEvents = "none";
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        canvas.style.pointerEvents = "auto";
      }, 200)
    }
    canvas.addEventListener("wheel", handleScroll)

    const render = () => {
      Matter.Engine.update(engine, 1000 / 60);
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      platforms.forEach((platform) => {
        const { x, y } = platform.position;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(platform.angle - platform.angle);

        const verts = platform.vertices;
        ctx.beginPath();
        ctx.moveTo(verts[0].x - x, verts[0].y - y);
        for (let j = 1; j < verts.length; j++) {
          ctx.lineTo(verts[j].x - x, verts[j].y - y);
        }
        ctx.closePath()
        ctx.fillStyle = platform.render.fillStyle || "#ff0000";
        ctx.fill();
        ctx.restore();
      });

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

    Matter.Body.rotate(platforms[0], -0.5);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      Matter.Body.setPosition(walls[0], { x: canvas.width / 2, y: canvas.height + 25 })
      Matter.Body.scale(walls[0], canvas.width / prevCanvasWidth, 1);
      Matter.Body.setPosition(walls[1], { x: -25, y: canvas.height / 2, })
      Matter.Body.scale(walls[1], 1, canvas.height / prevCanvasHeight)
      Matter.Body.setPosition(walls[2], { x: canvas.width + 25, y: canvas.height / 2, })
      Matter.Body.scale(walls[2], 1, canvas.height / prevCanvasHeight)
      Matter.Body.setPosition(platforms[0], { x: canvas.width / 2, y: canvas.height / 2 })
      prevCanvasWidth = canvas.width;
      prevCanvasHeight = canvas.height;
    }
    window.addEventListener("resize", handleResize)
    return () => {
      // Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      canvas.remove();
    }
  }, [technologies])

  return (
    <canvas ref={canvasRef} className={"backface " + className} id="backface"></canvas>
  )
};
