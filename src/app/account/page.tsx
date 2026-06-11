"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserCircleIcon,
  PencilSquareIcon,
  LockClosedIcon,
  CalendarDaysIcon,
  QuestionMarkCircleIcon,
  PhoneIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  TrashIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
}

// ── Section card ────────────────────────────────────────────────────────────

type NavItem = {
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
};

function SectionCard({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-3.5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h2>
      </div>
      <ul>
        {items.map((item, i) => (
          <li key={item.href} className={i !== 0 ? "border-t border-slate-50" : ""}>
            <Link
              href={item.href}
              className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <item.icon className="h-4.5 w-4.5 h-[18px] w-[18px] text-slate-600" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="mt-0.5 truncate text-xs text-slate-400">{item.description}</p>
              </div>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-slate-300" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Delete modal ─────────────────────────────────────────────────────────────

function DeleteModal({ onClose, onConfirm, loading }: {
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <TrashIcon className="h-6 w-6 text-red-600" strokeWidth={1.75} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Delete account?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          This will permanently delete your account. Your bookings and data will be removed. This action cannot be undone.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? "Deleting…" : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const router  = useRouter();
  const { user, isAuthenticated, isLoading, logout, deleteAccount } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading,   setDeleteLoading]   = useState(false);
  const [deleteError,     setDeleteError]     = useState("");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
  }, [isLoading, isAuthenticated, router]);

  async function handleDeleteAccount() {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await deleteAccount();
      setShowDeleteModal(false);
      router.push("/");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Could not delete account.");
      setDeleteLoading(false);
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (isLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  const accountItems: NavItem[] = [
    {
      label: "Edit Profile",
      description: "Update your display name",
      href: "/account/edit-profile",
      icon: PencilSquareIcon,
    },
    ...(user.provider === "LOCAL"
      ? [{
          label: "Change Password",
          description: "Update your account password",
          href: "/account/change-password",
          icon: LockClosedIcon,
        } as NavItem]
      : []),
  ];

  const activityItems: NavItem[] = [
    {
      label: "My Bookings",
      description: "View and manage your property bookings",
      href: "/bookings",
      icon: CalendarDaysIcon,
    },
  ];

  const supportItems: NavItem[] = [
    {
      label: "How it Works",
      description: "Learn about Rentora Houselink",
      href: "/how-it-works",
      icon: QuestionMarkCircleIcon,
    },
    {
      label: "Contact Us",
      description: "Get in touch with our team",
      href: "/contact",
      icon: PhoneIcon,
    },
  ];

  const legalItems: NavItem[] = [
    {
      label: "Terms of Use",
      description: "Read our terms and conditions",
      href: "/terms",
      icon: DocumentTextIcon,
    },
    {
      label: "Privacy Policy",
      description: "Understand how we use your data",
      href: "/privacy",
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <>
      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          loading={deleteLoading}
        />
      )}

      <main className="min-h-[calc(100vh-64px)] bg-slate-50 pb-16">
        <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">

          {/* ── Profile card ─────────────────────────────────────────────── */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="h-16 bg-gradient-to-r from-emerald-600 to-emerald-800" />
            <div className="relative px-6 pb-6">
              {/* Avatar */}
              <div className="-mt-8 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-emerald-600 text-xl font-extrabold text-white shadow-sm">
                {getInitials(user.name)}
              </div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-lg font-extrabold text-slate-900">{user.name}</h1>
                  <p className="text-sm text-slate-500">{user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      {user.role}
                    </span>
                    {user.provider !== "LOCAL" && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {user.provider} account
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href="/account/edit-profile"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  Edit
                </Link>
              </div>
            </div>
          </div>

          {/* ── Navigation sections ──────────────────────────────────────── */}
          <div className="space-y-4">
            <SectionCard title="Account Settings" items={accountItems} />
            <SectionCard title="Activity"         items={activityItems} />
            <SectionCard title="Support"          items={supportItems} />
            <SectionCard title="Legal"            items={legalItems} />
          </div>

          {/* ── Sign out ─────────────────────────────────────────────────── */}
          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowRightStartOnRectangleIcon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
            Sign Out
          </button>

          {/* ── Danger zone ──────────────────────────────────────────────── */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
            <div className="border-b border-red-50 px-5 py-3.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Danger Zone
              </h2>
            </div>
            {deleteError && (
              <p className="border-b border-red-50 px-5 py-2.5 text-xs text-red-600">{deleteError}</p>
            )}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-red-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <TrashIcon className="h-[18px] w-[18px] text-red-500" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-sm font-semibold text-red-600">Delete Account</p>
                <p className="mt-0.5 text-xs text-slate-400">Permanently remove your account and all data</p>
              </div>
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-300">
            Account ID: {user.id.slice(0, 8)}…
          </p>
        </div>
      </main>
    </>
  );
}