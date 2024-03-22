/**pagina para mostrar la informacion del usuario conectado */

import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";


export default async function ProfilePage() {

    const session = await auth(); //en el session.user tengo toda la info del usuario

    if( !session?.user ) {
        //si la session no existe, lo mando a la home
        redirect('/');
    }
  return (
    <div>
      <Title title="Tu perfil" />
      <pre>
      {
       JSON.stringify( session.user,null,2 )
      }
      </pre>
    <h3 className="text-3xl">Rol: { session.user.role }</h3> {/*Gracias a todo lo que hicimos con el token y la data, tenemos acceso al rol del usuario */}
    </div>
  );
}