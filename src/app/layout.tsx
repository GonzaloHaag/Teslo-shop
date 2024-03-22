import type { Metadata } from "next";
import "./globals.css";
import { inter } from "@/config/fonts";
import { Providers } from "@/components";

/**este es mi layout global para toda la app */

export const metadata: Metadata = {
  title: {
    //Si yo quiero que Teslo | shop aparezca en todas mis paginas, debo hacer esto
    // el %s indica que alli ira lo que cambie en cada metadata de mis otras paginas
    template: '%s - Teslo | shop',
    default: 'HomePage - Teslo | shop' //valor por defecto si no me pasan el %s
  },
  description: "Una tienda virtual de productos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers> {/*Este es mi SessionProvider para saber la session del lado del cliente */}
          {children}
        </Providers>

      </body>
    </html>
  );
}
