import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWordpress, faElementor, faPython } from "@fortawesome/free-brands-svg-icons";

import { IconDefinition } from "@fortawesome/free-brands-svg-icons";
const iconMap: Record<string, IconDefinition> = {
  wordpress: faWordpress,
  elementor: faElementor,
  python: faPython
};

export default function Chips({ hiddenResponsive, chips }: { hiddenResponsive: boolean, chips: Array<string> }) {
  return (
    <ul className={hiddenResponsive ? "flex md:hidden" : "flex" + " gap-2 my-2"}>
      {chips.map(chip => {
        const key = chip.trim().toLowerCase();
        const icon = iconMap[key];

        return (
          <li key={chip} className="text-xs p-1 border-1 border-stone-700 text-stone-300 rounded-full flex gap-1 items-center">
            {icon && <FontAwesomeIcon icon={icon} width="18" height="18" />}
            {chip}
          </li>
        )
      })}
    </ul>
  )
}
