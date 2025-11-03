import Image from "next/image";
import SkillCanvas from "./skillCanvas";

export default function Home() {
  return (
    <main>
      <header className="p-4 w-full h-screen flex justify-center items-center">
        <article className="m-auto z-1">
          <h1>I am brett</h1>
        </article>
        <SkillCanvas className="absolute z-0 w-full h-screen" technologies={["Elementor"]}></SkillCanvas>
      </header>
    </main>
  );
}
