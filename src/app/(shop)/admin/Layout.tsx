import { auth } from "@/auth.config";
import { redirect } from "next/navigation";


/**La idea de este layout, es poder protejer las rutas que sean /admin y que solo
 * pueda entrar el administrador
 */
export default async function AdminLayout({
 children
}: {
 children: React.ReactNode;
}) {

    const session = await auth();
    if( session?.user.role !== 'admin' ) {
        redirect('/login')
    }
  return (
    <>
    { children }
    </>
  );
}