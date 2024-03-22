/**Este layout corresponde a las rutas que sean /auth o /auth/ruta adcional como la de /auth/login */

import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function AuthLayout({children}: {children: React.ReactNode;}) {
    //indico que el children es un react.reactNode

    //aca podemos saber la session del usuario, porque estamos del lado del servidor
    const session = await auth();
    
    if( session?.user ) {
      //si hay un usuario, lo mando a la home
      redirect('/')
    }
  return (
    <main className="flex justify-center">
         <div className="w-full sm:max-w-[350px] px-10">
         { children }
         </div>
    </main>
  );
}