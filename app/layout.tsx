import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { AppearanceProvider } from "@/components/shared/appearance-provider";
import { ThemeBackground } from "@/components/shared/theme-background";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AIPlatform — AI-Powered Business Growth",
  description: "All-in-one AI platform: brand generation, content creation, campaign management, and CRM.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen relative" suppressHydrationWarning>
        {/* Dark mode init — runs before paint to prevent flash */}
        <Script id="theme-init" strategy="beforeInteractive">{`
          try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}
        `}</Script>

        {/* Background — React component, reacts to dark class changes via MutationObserver */}
        <ThemeBackground />

        {/* Gradient orbs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-[30%] -right-[10%] h-[700px] w-[700px] rounded-full bg-violet-300/20 dark:bg-violet-900/10 blur-[130px] transition-colors duration-500" />
          <div className="absolute -bottom-[25%] -left-[15%] h-[600px] w-[600px] rounded-full bg-indigo-200/25 dark:bg-indigo-900/8 blur-[110px] transition-colors duration-500" />
          <div className="absolute top-[40%] left-[35%] h-[450px] w-[450px] rounded-full bg-fuchsia-200/15 dark:bg-fuchsia-900/6 blur-[90px] transition-colors duration-500" />
        </div>

        <AppearanceProvider>
          {children}
        </AppearanceProvider>
        <Toaster />
      </body>
    </html>
  );
}
