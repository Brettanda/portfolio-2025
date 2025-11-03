import { notFound } from "next/navigation";
import { getBlogPosts } from "../utils";
import Chips from "@/app/components/chips";
import ButtonReadMore from "@/app/components/buttonReadMore";
import TechStackCanvas from "./techStackCanvas";
import ImageCarousel from "@/app/components/imageCarousel";

export async function generateStaticParams() {
  let posts = await getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = (await getBlogPosts()).find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="">
      <section className="h-screen flex justify-end items-center w-1/2 p-8 dotted-background">
        <div className="w-[500px] max-w-[50vw]">
          <h1>{post.metadata.title}</h1>
          <p>{post.metadata.description}</p>
          <p className="flex md:hidden mt-4 font-bold">Technologies used:</p>
          <Chips hiddenResponsive={true} chips={post.metadata.technologies} />
          <div className="mt-4"><ButtonReadMore href="#gallery" text="View Gallery" /></div>
        </div>

        <section className="absolute bg-radial to-stone-300 dark:to-stone-950 dark:from-stone-900 from-30% to-85% h-screen w-1/2 right-0">
          <TechStackCanvas technologies={post.metadata.technologies} />
        </section>
      </section>

      {post.metadata.images &&
        <section id="gallery">
          <ImageCarousel images={post.metadata.images} />
        </section>
      }

      <section className="mx-auto w-[800px] p-8 content" dangerouslySetInnerHTML={{ __html: post.html }}></section>
    </main>
  )
}
