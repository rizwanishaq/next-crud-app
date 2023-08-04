import Nav from "@components/Nav";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RiisBiTech",
  description: "Discover & Share AI ideas",
  keywords:
    "AI, AI ideas, AI research, AI research ideas, AI research projects",
  author: "Rizwan Ishaq",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="main"></div>
        <div className="gradient" />
        <main className="app">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
}
