import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faElementor } from "@fortawesome/free-brands-svg-icons";

export default function Chips({ chips }: { chips: Array<string> }) {
  return (
    <ul className="flex gap-2 my-2">
      {chips.map(chip => (
        <li className="text-xs p-1 border-1 border-stone-400 text-stone-400 rounded-lg flex gap-1 items-center">
          <FontAwesomeIcon icon={faElementor} width="18" height="18" />
          {chip}
        </li>
      ))}
    </ul>
  )
}
