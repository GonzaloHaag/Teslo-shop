'use client';
import Image from "next/image";
import { useCartStore } from "@/store/cart/cart-store";
import { useEffect, useState } from "react";
import { FormatoMoneda } from "@/utils";
//la idea es mostrar este componente si tengo al menos 1 producto en mi carrito

export const ProductsInCheckout = () => {
 /**Debemos usar si o si un useState que tenga un loading, porque sino dara error de hidratacion */
    const [isLoading,setIsLoading] = useState(false);
    //voy a tomar los productos que estan en el carrito desde mi estado global
    const productsInCart = useCartStore((state) => state.productsInCart);
    useEffect(() => {
        //con esto le damos la chance a zustand de cargar el carrito de compras y no tenga problemas de hidratacion
    setIsLoading( true )
    },[]);
    if( !isLoading ) {
        return <p>Cargando...</p>
    };

  return (
    <>
         {
              productsInCart.map((product) => (
                //aca yo puedo tener 2 productos con el mismo slug, por lo tanto debemos construir la key para que sea unica
                <div key={`${ product.slug } - ${ product.size }`} className="flex mt-5">
                  <Image
                  src={`/products/${ product.image }`} 
                  width={ 100 }
                  height={ 100 }
                  style={{
                    width:'100px',
                    height:'100px'
                  }}
                  alt={product.title}
                  className="mr-5 rounded"
                  />
                  <div>
                    <span>
                        { product.size } - { product.title } ({ product.quantity })
                    </span>
                    <p className="font-bold">{ FormatoMoneda(product.price * product.quantity) }</p>
                  </div>
                </div>
              ))
             }
    </>
  )
}
