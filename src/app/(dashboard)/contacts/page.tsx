"use client";

import { useState, useMemo, useCallback } from "react";
import { mockContacts } from "@/data/contacts";
import {
  defaultProperties,
  customProperties as initialCustomProperties,
} from "@/data/properties";
import {
  Contact,
  ContactProperty,
  ContactSource,
  ContactType,
  SortDirection,
  SortField,
} from "@/data/types";
import {
  searchContacts,
  filterContacts,
  sortContacts,
  paginateContacts,
} from "@/lib/utils";
import ContactsTable from "@/components/contacts/ContactsTable";
import ContactSearch from "@/components/contacts/ContactSearch";
import ContactFilters from "@/components/contacts/ContactFilters";
import Pagination from "@/components/contacts/Pagination";
import AddContactModal from "@/components/contacts/AddContactModal";
import ContactDetailPanel from "@/components/contacts/ContactDetailPanel";
import ContactProperties from "@/components/contacts/ContactProperties";
import BulkImportWizard from "@/components/contacts/BulkImportWizard";
import { RefreshCw, UserPlus, Upload } from "lucide-react";

type Tab = "contacts" | "properties";

export default function ContactsPage() {
  // Data state
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [customProps, setCustomProps] = useState<ContactProperty[]>(
    initialCustomProperties
  );
  const allProperties = useMemo(
    () => [...defaultProperties, ...customProps],
    [customProps]
  );

  // Tab
  const [activeTab, setActiveTab] = useState<Tab>("contacts");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<ContactSource | null>(null);
  const [typeFilter, setTypeFilter] = useState<ContactType | null>(null);

  // Sort
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Derived data
  const filteredContacts = useMemo(() => {
    let result = searchContacts(contacts, searchQuery);
    result = filterContacts(result, sourceFilter, typeFilter);
    result = sortContacts(result, sortField, sortDirection);
    return result;
  }, [contacts, searchQuery, sourceFilter, typeFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredContacts.length / perPage);
  const paginatedContacts = useMemo(
    () => paginateContacts(filteredContacts, page, perPage),
    [filteredContacts, page, perPage]
  );

  // Handlers
  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1);
  }

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  function handleAddContact(contact: Contact) {
    setContacts((prev) => [contact, ...prev]);
  }

  function handleBulkImport(imported: Contact[]) {
    setContacts((prev) => [...imported, ...prev]);
  }

  function handleAddProperty(prop: ContactProperty) {
    setCustomProps((prev) => [...prev, prop]);
  }

  function handleUpdateProperty(prop: ContactProperty) {
    setCustomProps((prev) =>
      prev.map((p) => (p.id === prop.id ? prop : p))
    );
  }

  function handleDeleteProperty(id: string) {
    setCustomProps((prev) => prev.filter((p) => p.id !== id));
  }

  const now = new Date();
  const refreshTime = `${now.getDate()} ${now.toLocaleString("en", {
    month: "long",
  })} ${now.getFullYear()} @ ${now.toLocaleTimeString("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}`;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-[32px] font-semibold leading-[40px] text-[#111824]">Contacts List</h1>
          <p className="text-[16px] text-gray-500 mt-1">
            View and manage contacts & contact properties
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setBulkImportOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Upload size={16} />
            Bulk create
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 bg-[#4361EE] hover:bg-[#3651DE] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <UserPlus size={16} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200 mt-8 mb-6">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "contacts"
              ? "border-[#4361EE] text-[#4361EE]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Contacts
        </button>
        <button
          onClick={() => setActiveTab("properties")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "properties"
              ? "border-[#4361EE] text-[#4361EE]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Contact Properties
        </button>
      </div>

      {activeTab === "contacts" ? (
        <>
          {/* Search + Filters */}
          <div className="flex items-center gap-3 mb-3">
            <ContactSearch onSearch={handleSearch} />
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <RefreshCw size={16} />
            </button>
            <span className="text-xs text-gray-400">
              Last Refreshed on {refreshTime}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              Showing {Math.min((page - 1) * perPage + 1, filteredContacts.length)}-
              {Math.min(page * perPage, filteredContacts.length)} of{" "}
              <strong>{filteredContacts.length}</strong> results
            </div>
            <ContactFilters
              source={sourceFilter}
              type={typeFilter}
              onSourceChange={(v) => {
                setSourceFilter(v);
                setPage(1);
              }}
              onTypeChange={(v) => {
                setTypeFilter(v);
                setPage(1);
              }}
            />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <ContactsTable
              contacts={paginatedContacts}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onContactClick={setSelectedContact}
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              perPage={perPage}
              totalItems={filteredContacts.length}
              onPageChange={setPage}
              onPerPageChange={(v) => {
                setPerPage(v);
                setPage(1);
              }}
            />
          </div>
        </>
      ) : (
        <ContactProperties
          properties={allProperties}
          onAdd={handleAddProperty}
          onUpdate={handleUpdateProperty}
          onDelete={handleDeleteProperty}
        />
      )}

      {/* Modals & Panels */}
      <AddContactModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddContact}
        properties={allProperties}
      />

      <BulkImportWizard
        open={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
        onImport={handleBulkImport}
        properties={allProperties}
        existingContacts={contacts}
      />

      <ContactDetailPanel
        contact={selectedContact}
        properties={allProperties}
        onClose={() => setSelectedContact(null)}
      />
    </div>
  );
}
