import type { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const dmSans = DM_Sans({
  variable: "--dm-sans",
  subsets: ["latin"],
});

// const dmMono = DM_Mono({
//   variable: "--dm-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Plura",
  description: "All in one Agency Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en" suppressHydrationWarning>
      <body
      // ${dmMono.variable}
        className={`${dmSans.variable}  antialiased`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
    
  );
}
