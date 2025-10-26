import Chips from "../components/chips";

export default function ProjectPage() {
  return (
    <main className="min-h-screen">
      <section className="h-[95vh] flex justify-end items-center w-1/2 p-8">
        <div className="w-[500px] max-w-[50vw]">
          <h1>the project</h1>
          <p>the description of the project here</p>
          <Chips chips={["Elementor", "WordPress"]} />
        </div>
        <section className="absolute bg-stone-500 h-[95vh] w-1/2 right-0"></section>
      </section>
      <section className="h-[95vh]">
        <div>
          <img />
        </div>
      </section>
    </main>
  )
}
