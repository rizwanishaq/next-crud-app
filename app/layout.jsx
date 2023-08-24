import Nav from "@components/Nav";
import "./globals.css";
import { Inter } from "next/font/google";
import MimicProvider from "@contexts/MimicContext";
import WeatherContextProvider from "@contexts/WeatherContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Utopia",
  description: "Discover & Share AI ideas",
  keywords:
    "AI, AI ideas, AI research, AI research ideas, AI research projects",
  author: "Utopia Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="main"></div>
        <div className="gradient" />
        <main className="app">
          <WeatherContextProvider>
            <Nav />
            <MimicProvider>{children}</MimicProvider>
          </WeatherContextProvider>
        </main>
      </body>
    </html>
  );
}
