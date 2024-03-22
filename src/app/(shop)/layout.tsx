/**Como la carpeta de shop esta entre (), el layout sera para toda mi aplicacion de shop. Al ponerla entre () indicamos 
 * que no es una ruta, pero si toma el layout --> para trabajar mas ordenado
 * Esto es como estar trabajandolo global en el layout global, pero para ser mas ordenado lo pongo en una carpeta que 
 * tenga () y trabajo asi. Este layout correspondera a la ruta inicial /, y a todas las demas, como /admin, /cart 
 */

import { Footer, SideBar, TopMenu } from "@/components";

export default function ShopLayout({children}: {children: React.ReactNode;}) {
    //indico que el children es un react.reactNode
  return (
    <main className="min-h-screen">

      {/*mi top menu sera fijo en todas las paginas que esten dentro de shop (recordar que no es ruta, es como si estuvieramos en la home) */}
      <TopMenu />
      <SideBar /> {/*menu lateral fijo en todas las paginas dentro de (shop) que es mi home / */}
      <div className="px-0 sm:px-10">
      { children }
      </div>
       <Footer /> {/*Fijo en todas las paginas principales */}
    </main>
  );
}