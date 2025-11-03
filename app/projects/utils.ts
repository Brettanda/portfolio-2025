import fs from 'fs';
import path from 'path';
import matter from "gray-matter";
import { remark } from 'remark';
import html from "remark-html";
// import { metadata } from '../layout';

type Metadata = {
  title: string
  description: string
  images?: string[]
  technologies: string[]
}

function getFrontMatter(fileContent: string) {
  const { content, data } = matter(fileContent)
  return {
    content,
    metadata: data as Metadata
  }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.md')
}

function readMDXFile(filePath: string) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return getFrontMatter(rawContent)
}

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

// function getMDXData(dir: string) {
// let mdxFiles = getMDXFiles(dir)
// return mdxFiles.map((file) => {
// let { metadata, content } = readMDXFile(path.join(dir, file))
// let slug = path.basename(file, path.extname(file))

// return {
// metadata,
// slug,
// content,
// }
// })
// }

export async function getBlogPosts() {
  const dir = path.join(process.cwd(), "content");
  const mdxFiles = getMDXFiles(dir);

  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const { metadata, content } = readMDXFile(path.join(dir, file));
      const slug = path.basename(file, path.extname(file));
      const htmlContent = await markdownToHtml(content);

      return {
        metadata,
        slug,
        html: htmlContent
      }
    })
  )
  return posts;
  // return getMDXData(path.join(process.cwd(), 'content'))
}
