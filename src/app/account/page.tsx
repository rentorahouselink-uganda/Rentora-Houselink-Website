"use client";

import { useEffect, useState, type ElementType } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
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
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/auth/auth-context";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0][0].toUpperCase();
}

// ── Section card ──
type NavItem = {
  label: string;
  description: string;
  href: string;
  icon: ElementType;
};

function SectionCard({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </h2>
      </div>
      <ul>
        {items.map((item, i) => (
          <li
            key={item.href}
            className={i !== 0 ? "border-t border-slate-100 dark:border-slate-800" : ""}
          >
            <Link
              href={item.href}
              className="group flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-white dark:bg-slate-800 dark:group-hover:bg-slate-700">
                <item.icon
                  className="h-5 w-5 text-slate-600 dark:text-slate-400"
                  strokeWidth={1.75}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400">
                  {item.label}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-emerald-600 dark:text-slate-600 dark:group-hover:text-emerald-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Page ──
export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, deleteAccount } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

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
      setDeleteError(
        err instanceof Error ? err.message : "Could not delete account.",
      );
      setDeleteLoading(false);
    }
  }

  function handleConfirmLogout() {
    logout();
    router.push("/");
    setShowLogoutModal(false);
  }

  function handleLogoutClick() {
    setShowLogoutModal(true);
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 dark:bg-slate-950">
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
      ? [
          {
            label: "Change Password",
            description: "Update your account password",
            href: "/account/change-password",
            icon: LockClosedIcon,
          } as NavItem,
        ]
      : []),
  ];

  const activityItems: NavItem[] = [
    {
      label: "My Bookings",
      description: "View and manage your property bookings",
      href: "/bookings",
      icon: CalendarDaysIcon,
    },
    {
      label: "Saved Properties",
      description: "View your favorited listings",
      href: "/account/favorites",
      icon: HeartIcon,
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
      {/* Delete Account Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete account?"
        description="This will permanently delete your account. Your bookings and data will be removed. This action cannot be undone."
        confirmText="Delete Account"
        icon={<TrashIcon className="h-6 w-6" strokeWidth={1.75} />}
        isLoading={deleteLoading}
        isDanger={true}
      />

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        title="Sign out?"
        description="You will be signed out of your account. You can always sign back in anytime."
        confirmText="Sign Out"
        icon={
          <ArrowRightStartOnRectangleIcon className="h-6 w-6" strokeWidth={1.75} />
        }
      />

      <main className="min-h-[calc(100vh-64px)] bg-slate-50 pb-16 dark:bg-slate-950">
        <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">
          {/* ── Profile card ── */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="h-24 bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-700 dark:to-emerald-900" />
            <div className="relative px-6 pb-6">
              <div className="-mt-10 mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-emerald-600 text-2xl font-extrabold text-white dark:border-slate-900">
                {getInitials(user.name)}
              </div>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {user.role}
                    </span>
                    {user.provider !== "LOCAL" && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {user.provider} account
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href="/account/edit-profile"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* ── Navigation sections ── */}
          <div className="space-y-6">
            <SectionCard title="Account Settings" items={accountItems} />
            <SectionCard title="Activity" items={activityItems} />
            <SectionCard title="Support" items={supportItems} />
            <SectionCard title="Legal" items={legalItems} />
          </div>

          {/* ── Sign out ── */}
          <button
            onClick={handleLogoutClick}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            Sign Out
          </button>

          {/* ── Danger zone ── */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-red-200 bg-white dark:border-red-900/50 dark:bg-slate-900">
            <div className="border-b border-red-100 bg-red-50/50 px-5 py-4 dark:border-red-900/30 dark:bg-red-950/20">
              <h2 className="text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
                Danger Zone
              </h2>
            </div>
            {deleteError && (
              <p className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 dark:border-red-900/30 dark:bg-red-950/50 dark:text-red-400">
                {deleteError}
              </p>
            )}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 transition-colors group-hover:bg-red-100 dark:bg-red-900/20 dark:group-hover:bg-red-900/40">
                <TrashIcon
                  className="h-5 w-5 text-red-500 dark:text-red-400"
                  strokeWidth={1.75}
                />
              </span>
              <div>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  Delete Account
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Permanently remove your account and all data
                </p>
              </div>
            </button>
          </div>

          <p className="mt-8 text-center text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-slate-600">
            Account ID: {user.id.slice(0, 8)}…
          </p>
        </div>
      </main>
    </>
  );
}