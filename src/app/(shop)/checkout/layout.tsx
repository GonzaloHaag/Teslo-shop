import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

/**Layout general para la pantalla de /checkout y /checkout/address 
 * La idea es que si la persona no tiene una session ,es decir, no esta iniciada, no pueda ingresar a estas paginas
*/
export default async function CheckoutLayout({
 children
}: {
 children: React.ReactNode;
}) {


  /**Esto es muy importante para protejerme de que no puedan entrar al checkout sin estar inicidos, 
   * porque me pueden poner la url /checkout y entrar
   * Con esto me estoy protejiendo de eso, y si o si deben estar iniciados sesion para entrar a la 
   * pagina de checkout y checkout/address
   */
    const session = await auth();

    if( !session?.user ) {
        //Si el usuario no esta iniciado, lo dirijo a iniciar session para ir al checkout
        redirect("/auth/login?redirectTo=/checkout/address"); //http://localhost:3000/auth/login?redirectTo=/checkout/address
    }
  return (
    <>
      { children }
    </>
  );
}