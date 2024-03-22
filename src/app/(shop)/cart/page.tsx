/**  Recordemos que estoy trabaando shop como una carpeta simplemente, no es una ruta,
 * por lo tanto esta pagina corresponde a http://localhost:3000/cart
 */

import {  Title } from "@/components";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";

export default function CartPage() {
  
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
       <div className="flex flex-col w-[1000px]">
         <Title title="Carrito" />
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/**carrito */}
             <div className="flex flex-col mt-5">
               <span className="text-xl">Agregar más items</span>
               <Link href='/' className="underline mb-5">
                Continúa comprando
               </Link>
       

             {/**items */}
           <ProductsInCart />
          </div>
          {/*checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
             <h2 className="text-2xl mb-2">Resumen de la orden</h2>
             <OrderSummary />
             <div className="mt-5 mb-2 w-full">
               <Link className="flex btn-primary justify-center" href='/checkout/address'>Checkout</Link>
             </div>
          </div>
         </div>
       </div>
    </div>
  );
}