"use client";

import { Contact, SortDirection, SortField } from "@/data/types";
import { formatAge } from "@/lib/utils";
import ContactTypeBadge from "./ContactTypeBadge";
import { ArrowUp, ArrowDown, MoreVertical } from "lucide-react";

interface ContactsTableProps {
  contacts: Contact[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onContactClick: (contact: Contact) => void;
}

function SortIcon({
  field,
  currentField,
  direction,
}: {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
}) {
  if (field !== currentField) return null;
  return direction === "asc" ? (
    <ArrowUp size={12} className="text-gray-400" />
  ) : (
    <ArrowDown size={12} className="text-gray-400" />
  );
}

function getIdentifier(contact: Contact): string {
  const email = contact.properties.email as string;
  const mobile = contact.properties.mobile_number as string;
  return email || mobile || "-";
}

export default function ContactsTable({
  contacts,
  sortField,
  sortDirection,
  onSort,
  onContactClick,
}: ContactsTableProps) {
  const headers: { label: string; field: SortField }[] = [
    { label: "Contact", field: "name" },
    { label: "Type", field: "type" },
    { label: "Source", field: "source" },
    { label: "DoB (Age)", field: "dob" },
    { label: "Mobile Number", field: "mobile_number" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#F4F6F8] border-b border-gray-200">
            {headers.map((h) => (
              <th
                key={h.field}
                onClick={() => onSort(h.field)}
                className="text-left text-[14px] font-normal text-[#111824] px-5 py-4 cursor-pointer hover:opacity-70 transition-colors"
              >
                <div className="flex items-center gap-1">
                  {h.label}
                  <SortIcon
                    field={h.field}
                    currentField={sortField}
                    direction={sortDirection}
                  />
                </div>
              </th>
            ))}
            <th className="w-10"></th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              onClick={() => onContactClick(contact)}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-5 py-3.5">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {contact.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {getIdentifier(contact) !== "-"
                      ? getIdentifier(contact)
                      : ""}
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5">
                <ContactTypeBadge type={contact.type} />
              </td>
              <td className="px-5 py-3.5 text-sm text-gray-700 capitalize">
                {contact.source}
              </td>
              <td className="px-5 py-3.5 text-sm text-gray-700">
                {formatAge(contact.properties.dob as string | undefined)}
              </td>
              <td className="px-5 py-3.5 text-sm text-gray-700">
                {(contact.properties.mobile_number as string) || "-"}
              </td>
              <td className="px-5 py-3.5">
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="px-5 py-12 text-center text-sm text-gray-400"
              >
                No contacts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
