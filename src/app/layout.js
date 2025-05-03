import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "InnovDigital - Transforming Ideas into Digital Solutions",
  description: "We build cutting-edge digital solutions that help businesses transform, scale, and succeed in today's digital landscape.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider>
          <main className=" w-full flex-grow flex flex-col items-center justify-center">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
