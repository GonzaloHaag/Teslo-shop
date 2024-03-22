'use client'

import { useCartStore } from "@/store/cart/cart-store";
import { FormatoMoneda } from "@/utils";
import { useRouter } from "next/navigation";
import {  useEffect, useState } from "react"

//la idea es mostrar el resumen de la orden en este componente aparte, como uso valores de mi estado global, sera del lado del cliente
export const OrderSummary = () => {

    const router = useRouter();

    //recordemos hacer el loading para que no haya error de hidratacion
    const [isLoading,setIsLoading] = useState(false);

    const getOrderSummary = useCartStore((state) => state.getSummaryInformation()); //esta funcion ya me retorna todo lo que necesito

    useEffect(() => {
      setIsLoading( true ); //para evitar errores de hidratacion
    },[]);

    useEffect(() => {
        if( getOrderSummary.itemsInCart === 0 && isLoading === true ) {
            //Si no tengo productos en el carrito mostrame la pagina de carrito vacio
            router.replace('/cartempty')
        }
    },[ getOrderSummary.itemsInCart,isLoading,router ])

    if( !isLoading ) {
        return <p>Cargando...</p>
    }
    return (
        <div className="grid grid-cols-2 gap-2">
        <span>No. Productos</span>
        <span className="text-right">{ getOrderSummary.itemsInCart === 1 ? '1 artículo' : getOrderSummary.itemsInCart + ' artículos' } </span>
        <span>Subtotal</span>
        <span className="text-right">{ FormatoMoneda(getOrderSummary.subTotalPriceProducts) }</span>
        <span>Impuestos (15%)</span>
        <span className="text-right">{ FormatoMoneda(getOrderSummary.impuestos) }</span>
        <span className="mt-5 text-2xl font-bold">Total:</span>
        <span className="text-right mt-5 text-2xl font-bold">{ FormatoMoneda(getOrderSummary.totalPrice) }</span>
     </div>
 )
       
}
