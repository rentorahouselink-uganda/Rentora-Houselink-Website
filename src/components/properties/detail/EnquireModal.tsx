"use client";

import { useEffect, useState } from "react";
import {
  XMarkIcon, PhoneIcon, DocumentDuplicateIcon, CheckIcon,
} from "@heroicons/react/24/outline";
import { Property } from "@/types/property";

type Props = { property: Property; onClose: () => void; };

export function EnquireModal({ property, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const { contact } = property;

  const rawPhone = (contact.whatsapp ?? contact.phone).replace(/[\s\-+]/g, "");
  const waNumber = rawPhone.startsWith("0") ? `256${rawPhone.slice(1)}` : rawPhone;
  const waText = encodeURIComponent(`Hi ${contact.name}, I'm interested in "${property.title}" on Rentora Houselink. Could you share more details?`);
  const whatsappUrl = `https://wa.me/${waNumber}?text=${waText}`;

  const initials = contact.name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

  function handleCopy() {
    navigator.clipboard.writeText(contact.phone).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contact Agent</h2>
          <button onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition hover:bg-slate-200 dark:hover:bg-slate-700">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xl font-bold select-none">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white truncate">{contact.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{contact.role.replace(/_/g, " ").toLowerCase()}</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{contact.phone}</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-1">Enquiring about</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">{property.title}</p>
          </div>

          <div className="flex flex-col gap-3">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2.5 w-full rounded-xl bg-[#25D366] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#1fba5b]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              Chat on WhatsApp
            </a>
            <a href={`tel:${contact.phone}`} className="flex items-center justify-center gap-2.5 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3.5 text-base font-bold text-slate-900 dark:text-white transition hover:bg-slate-50 dark:hover:bg-slate-800">
              <PhoneIcon className="h-5 w-5" /> Call Agent
            </a>
            <button onClick={handleCopy} className="flex items-center justify-center gap-2 py-1.5 text-sm font-medium text-slate-400 dark:text-slate-500 transition hover:text-slate-700 dark:hover:text-slate-300">
              {copied ? (<><CheckIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-500" /><span className="text-emerald-600 dark:text-emerald-500">Copied to clipboard</span></>) : (<><DocumentDuplicateIcon className="h-4 w-4" /> Copy phone number</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}