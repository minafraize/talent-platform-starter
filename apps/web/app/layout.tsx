export const metadata = {
  title: 'Talent Network',
  description: 'Global social network built around talent.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
