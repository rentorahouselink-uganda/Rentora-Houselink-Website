import { Metadata } from 'next';
import ContactPageContent from './ContactPageContent';

// This safely stays here on the server side 
export const metadata: Metadata = {
  title: "Contact Us | Rentora Houselink",
  description:
    "Get in touch with our team for any inquiries or assistance regarding property listings on Rentora Houselink.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}