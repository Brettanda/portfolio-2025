import Link from "next/link";

export default function ButtonReadMore({ text, href }: { text: string, href: string }) {
  return (
    <Link className="border-b-1 border-stone-400" href={href}>{text}</Link>
  )
}
