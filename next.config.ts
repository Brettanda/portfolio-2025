import type { NextConfig } from "next";
import createMDX from "@next/mdx"

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  pageExtensions: ["js", 'jsx', "md", "mdx", "ts", "tsx"]
};

const withMDX = createMDX({ extension: /\.(md|mdx)$/, })

export default withMDX(nextConfig);
