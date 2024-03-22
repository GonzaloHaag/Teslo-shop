'use client';
import Image from "next/image";
import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store/cart/cart-store";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

//la idea es mostrar este componente si tengo al menos 1 producto en mi carrito

export const ProductsInCart = () => {
  const router = useRouter();
 /**Debemos usar si o si un useState que tenga un loading, porque sino dara error de hidratacion */
    const [isLoading,setIsLoading] = useState(false);
    //voy a tomar los productos que estan en el carrito desde mi estado global
    const productsInCart = useCartStore((state) => state.productsInCart);
    const removeProduct = useCartStore((state) => state.removeProductInCart);
   //me traigo la funcion de incrementar cantidad, por si quieren cambiar la cantidad desde el carrito

   const updatedQuantityProductInCart = useCartStore((state) => state.updatedQuantityProduct);


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
                  <ProductImage
                  src={ product.image } 
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
                    <Link href={`/product/${ product.slug }`} className="hover:underline hover:text-blue-500 cursor-pointer transition-colors duration-200">
                        { product.size } - { product.title }
                    </Link>
                    <p>${ product.price }</p>
                    <QuantitySelector 
                    onQuantityChanged={ (quantity) => updatedQuantityProductInCart(product,quantity)}
                    quantity={ product.quantity }
                    />
                    <button className="underline mt-3" onClick={() => removeProduct( product )}>
                      Remover
                    </button>
                  </div>
                </div>
              ))
             }
    </>
  )
}
