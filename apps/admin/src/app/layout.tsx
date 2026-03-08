import './globals.css';
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head><meta name="viewport" content="width=device-width, initial-scale=1" /></head><body className="bg-slate-50 text-slate-900">{children}</body></html>;
}
