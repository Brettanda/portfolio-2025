import Link from "next/link";
import Image from "next/image";

export default function Navigation() {
  return (
    <nav className="flex justify-between my-2 p-2 px-4 w-5xl align-middle absolute left-1/2 -translate-x-1/2 max-w-full">
      <Link href="/"><Image
        className=""
        src="/logo.png"
        alt="Next.js logo"
        width={50}
        height={50}
        priority
      /></Link>
      <ul className="flex gap-2">
        <li className="content-center"><Link href="/about">About</Link></li>
      </ul>
    </nav>
  )
}
