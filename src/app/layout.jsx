import '../index.css';

export const metadata = {
  title: 'seato-mockup',
  description: 'Seato mockup using Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
