import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google"
import Script from "next/script";
 
import { cn } from "@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
}) 

export const metadata: Metadata = {
  title: "UTA Grades",
  description: "UTA Grades Project at ACM UTA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-DENV8F61LB" />
        <Script  id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DENV8F61LB');
            `}
        </Script>
        </head>
      <body
        className={cn(
          "min-h-screen flex flex-col bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}