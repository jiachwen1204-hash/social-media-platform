import './globals.css';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body className="bg-gray-100">{children}</body></html>;
}
