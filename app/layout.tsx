import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "WellControled | Controle suas finanças", description: "Controle suas finanças. Conquiste seus objetivos." };
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="pt-BR" suppressHydrationWarning><body>{children}</body></html>;
}
