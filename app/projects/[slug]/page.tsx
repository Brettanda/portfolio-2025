import { notFound } from "next/navigation";
import { getBlogPosts } from "../utils";
import Chips from "@/app/components/chips";
import ButtonReadMore from "@/app/components/buttonReadMore";
import TechStackCanvas from "./techStackCanvas";
import ImageCarousel from "@/app/components/imageCarousel";

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = getBlogPosts().find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="">
      <section className="h-screen flex justify-end items-center w-1/2 p-8 dotted-background">
        <div className="w-[500px] max-w-[50vw]">
          <h1>{post.metadata.title}</h1>
          <p>{post.content}</p>
          <p className="flex md:hidden mt-4 font-bold">Technologies used:</p>
          <Chips hiddenResponsive={true} chips={post.metadata.technologies.split(", ")} />
          <div className="mt-4"><ButtonReadMore href="#gallery" text="View Gallery" /></div>
        </div>

        <section className="absolute bg-stone-500 h-screen w-1/2 right-0">
          <TechStackCanvas technologies={post.metadata.technologies.split(", ")} />
        </section>
      </section>

      <section className="h-screen">
        <ImageCarousel images={[]} />
      </section>
    </main>
  )
}
