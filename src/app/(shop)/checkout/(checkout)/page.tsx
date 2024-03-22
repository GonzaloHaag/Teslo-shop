/**  Recordemos que estoy trabaando shop como una carpeta simplemente, no es una ruta,
 * por lo tanto esta pagina corresponde a http://localhost:3000/checkout
 * La idea aca es que la persona se fije si esta llevando bien, ya tendriamos la informacion
 * Esta pagina sigue siendo la de /checkout, porque esta entre (), no influye
 */

import { Title } from "@/components";
import Link from "next/link";
import { ProductsInCheckout } from "./ui/ProductsInCheckout";
import { PlaceOrder } from "./ui/PlaceOrder";
export default function CartPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
       <div className="flex flex-col w-[1000px]">
         <Title title="Verificar compra" />
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/**carrito */}
             <div className="flex flex-col mt-5">
               <span className="text-xl">Ajustar elementos</span>
               <Link href='/cart' className="underline mb-5">
                Editar carrito
               </Link>
       

             {/**items */}
          <ProductsInCheckout />
          </div>
          {/*checkout - Resumen de orden */}
          <PlaceOrder />
         </div>
       </div>
    </div>
  );
}