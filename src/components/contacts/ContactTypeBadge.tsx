import { ContactType } from "@/data/types";

const typeStyles: Record<ContactType, string> = {
  prospect: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  patient: "bg-green-100 text-green-700",
  lead: "bg-amber-100 text-amber-700",
};

export default function ContactTypeBadge({ type }: { type: ContactType }) {
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${typeStyles[type]}`}
    >
      {type}
    </span>
  );
}
