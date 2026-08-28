import {
  Briefcase,
  Cookie,
  Files,
  Inbox,
  Image,
  Layers,
  LayoutDashboard,
  Mail,
  MessageSquareText,
  Newspaper,
  Users,
  Wrench,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquareText },
  { label: "Contacts", href: "/admin/contacts", icon: Inbox },
  { label: "Newsletter", href: "/admin/newsletter-subscribers", icon: Mail },
  { label: "Blogs", href: "/admin/blogs", icon: Newspaper },
  { label: "Products", href: "/admin/products", icon: Layers },
  { label: "Services", href: "/admin/single-services", icon: Wrench },
  {
    label: "Pages",
    basePath: "/admin/pages",
    icon: Files,
    children: [
      { label: "Home", href: "/admin/pages/home" },
      { label: "Process", href: "/admin/pages/process" },
      { label: "About", href: "/admin/pages/about" },
      { label: "Contact", href: "/admin/pages/contact" },
      { label: "CSR", href: "/admin/pages/csr" },
      { label: "Services Page", href: "/admin/pages/services" },
    ],
  },
  {
    label: "Careers",
    basePath: "/admin/career",
    icon: Briefcase,
    children: [
      { label: "Positions", href: "/admin/career-positions" },
      { label: "Applications", href: "/admin/career-applications" },
    ],
  },
  { label: "Cookie Consents", href: "/admin/cookie-consents", icon: Cookie },
  { label: "Media", href: "/admin/media", icon: Image },
  { label: "Users", href: "/admin/users", icon: Users, superAdminOnly: true },
];
