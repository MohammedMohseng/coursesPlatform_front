import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const cairo = localFont({
  src: [{
    path: "./../../public/fonts/Cairo/static/Cairo-Regular.ttf",
    weight: "300",
    style: ""
  }
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduPlatform | منصة المجتمع والأكاديمية",
  description: "منصة تفاعلية اجتماعية وأكاديمية لدفعه EduPlatform. شارك الذكريات، العب ألعاب الذكاء الاصطناعي، وصل إلى المصادر الأكاديمية والمزيد.",
  keywords: ["EduPlatform", "كلية", "أكاديمية", "مجتمع", "ألعاب ذكاء اصطناعي"],
  authors: [{ name: "Mohammed Mohsen" }],
  icons: {
    icon: "/favicon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.className} antialiased bg-background text-foreground font-[family-name:var(--font-cairo)]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          storageKey="EduPlatform-theme"
        >
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
      </body>
    </html>
  );
}
