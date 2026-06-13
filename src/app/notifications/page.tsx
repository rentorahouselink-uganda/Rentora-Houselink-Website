import { Metadata } from "next";
import NotificationsPageContent from "./NotificationsPageContent";

// Safely compiled exclusively on the server side
export const metadata: Metadata = {
  title: "Notifications",
  description: "View real-time alerts, account configurations, listing progress tracking updates, and property manager coordination streams inside your Rentora Houselink dashboard.",
};

export default function NotificationsPage() {
  return <NotificationsPageContent />;
}