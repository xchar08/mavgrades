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
  title: "MavGrades",
  description: "Discover grade distributions for UTA courses and professors, empowering students to make well-informed class choices, featuring up-to-date and accurate grade data for all courses taught at UTA.",
  keywords: ["UTA", "course", "grades", "distribution", "professors"],
  authors: [{ name: "ACM @ UT Arlington" }],
  openGraph: {
     title: "MavGrades",
     description: "Discover grade distributions for UTA courses and professors, empowering students to make well-informed class choices, featuring up-to-date and accurate grade data for all courses taught at UTA.",
     url: "https://utagrades.com", 
     type: "website",
     images: [
        {
           url: "/landing.jpeg", 
           width: 1200,
           height: 630,
           alt: "Landing page image",
        },
     ],
     locale: "en_US",
     siteName: "MavGrades",
  },
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
          "bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#0e6aac] from-0% via-[#000000] via-60%  to-[#5d2c00] to-100% min-h-screen flex flex-col bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}