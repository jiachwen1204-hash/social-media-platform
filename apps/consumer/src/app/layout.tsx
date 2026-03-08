import './globals.css';
export const metadata = {
  title: 'SocialHub - Connect & Share',
  description: 'SocialHub is a modern social media platform to connect with friends, share moments, and discover content.',
  keywords: 'social media, connect, share, posts, reels, stories',
  openGraph: {
    title: 'SocialHub - Connect & Share',
    description: 'A modern social media platform to connect with friends and share moments.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialHub',
    description: 'Connect & Share on SocialHub',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <title>{metadata.title}</title>
      </head>
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
