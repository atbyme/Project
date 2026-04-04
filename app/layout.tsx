import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ComplianceShield AI | GDPR & HIPAA Compliance in Minutes",
  description:
    "Generate enterprise-grade GDPR & HIPAA compliance bundles in under 5 minutes. Powered by AI. Built for startups, law clinics, and modern firms.",
  metadataBase: new URL("https://project-eight-orpin-33.vercel.app"),

  alternates: { canonical: "/" },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "ComplianceShield AI",
    description: "Stop paying $3,000 for legal compliance. Generate your bundle today.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ scrollBehavior: 'smooth' }}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
