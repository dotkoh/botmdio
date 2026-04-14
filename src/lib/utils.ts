import { Contact, ContactSource, ContactType, SortDirection, SortField } from "@/data/types";

export function searchContacts(contacts: Contact[], query: string): Contact[] {
  if (!query.trim()) return contacts;
  const q = query.toLowerCase();
  return contacts.filter((c) => {
    const email = (c.properties.email as string) || "";
    const mobile = (c.properties.mobile_number as string) || "";
    return (
      c.name.toLowerCase().includes(q) ||
      email.toLowerCase().includes(q) ||
      mobile.includes(q)
    );
  });
}

export function filterContacts(
  contacts: Contact[],
  source: ContactSource | null,
  type: ContactType | null
): Contact[] {
  return contacts.filter((c) => {
    if (source && c.source !== source) return false;
    if (type && c.type !== type) return false;
    return true;
  });
}

export function sortContacts(
  contacts: Contact[],
  field: SortField,
  direction: SortDirection
): Contact[] {
  const sorted = [...contacts].sort((a, b) => {
    let aVal: string | number | null = null;
    let bVal: string | number | null = null;

    switch (field) {
      case "name":
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case "type":
        aVal = a.type;
        bVal = b.type;
        break;
      case "source":
        aVal = a.source;
        bVal = b.source;
        break;
      case "dob":
        aVal = (a.properties.dob as string) || "";
        bVal = (b.properties.dob as string) || "";
        break;
      case "mobile_number":
        aVal = (a.properties.mobile_number as string) || "";
        bVal = (b.properties.mobile_number as string) || "";
        break;
      case "created_at":
        aVal = a.created_at;
        bVal = b.created_at;
        break;
    }

    if (aVal === null && bVal === null) return 0;
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });

  return direction === "desc" ? sorted.reverse() : sorted;
}

export function paginateContacts(
  contacts: Contact[],
  page: number,
  perPage: number
): Contact[] {
  const start = (page - 1) * perPage;
  return contacts.slice(start, start + perPage);
}

export function formatAge(dob: string | null | undefined): string {
  if (!dob) return "-";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `${dob} (${age})`;
}

export function generateKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 50);
}
