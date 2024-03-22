'use client';
/**La idea es hacer la eleccion de talla y la cantidad a llevar del lado del cliente, porque
 * seran muy cambiantes, a esto se refiere next con que algunas partes son ramas que seran del lado del cliente, 
 * pero todo lo otro sera del lado del servidor
 */

import { QuantitySelector, SizeSelector } from "@/components"
import type { CartProduct, Product, Size } from "@/interfaces"
import { useCartStore } from "@/store/cart/cart-store";
import { useState } from "react";

interface Props {
  producto:Product;
}
export const AddToCart = ({ producto } : Props) => {
 //Llamo los valores que quiera de mi estado global
  const addProductToCart = useCartStore((state) => state.addProductToCart); //aca se llama sin el () porque recibe parametro
  const [size,setSize] = useState<Size | undefined>(); //voy a manejar la talla elegida aqui, que sera de tipo Size('M' | 'L' ...) o undefined
  const [quantity,setQuantity] = useState<number>(1); //aca voy a manejar la cantidad de productos que se llevan
  const [errorSize,setErrorSize] = useState( false ); //si no me seleccionan una talla, paso esto a true y muestro mensaje de error
  /**Funcion para ver la cantidad y la talla que se esta llevando 
   * al hacer click en agregar al carrito
   */
  const addToCart = () => {
    //si no me elijen una talla, va a ser undefined, entonces no quiero ejecutar nada y voy a lanzar un mensaje de que debe seleccionar una talla
    setErrorSize( true );
    if( !size ) return; //que no haga nada si no hay una talla seleccionada

   console.log({ size,quantity,producto })
    /**
     * En este punto ya tengo la talla, la cantidad y el producto para poder añadirlo al carrito
     * mi funcion del estado global de cart-store debe recibir esto para poder mostrarlo en el carrito
     */
     //aca me armo el producto para mandarlo a la funcion, porque no quiero enviar todo el producto entero que me llega
     const cartProduct:CartProduct =  {
       id: producto.id,
       slug: producto.slug,
       title: producto.title,
       price: producto.price,
       quantity: quantity,
       size: size ,
       image: producto.images[0]
     }
    addProductToCart( cartProduct );
    //aca ya se me agrego el producto al carrito, podemos hacer lo que quiera luego de ello, voy a resetear los valores
    //podria mostrar una alerta o algo de ello
    setErrorSize( false );
    setQuantity( 1 );
    setSize( undefined );
  }
  return (
    <>
    {
      errorSize && !size &&  (
        <span className="mt-5 text-red-500 fade-in">
        Debe seleccionar una talla*
      </span>
      )
    
    }
 
       {/**Como el selector de tallas, la cantidad de productos y el boton de agregar al carrito van a ser muy cambiantes
          * me los voy a llevar para hacerlo en un componente del lado del CLIENTE
           */}
          {/*Selector de tallas --> COMPONENTE */}
          <SizeSelector
          onSizeChange={ (size) => setSize( size ) }
          selectedSize={ size } 
          availableSizes={ producto.sizes } />
          {/*Selector de cantidad --> COMPONENTE */}
          <QuantitySelector 
          quantity={ quantity } 
          onQuantityChanged = {( quantity ) => setQuantity( quantity )}
          />
          {/*Button */}
          <button onClick={ addToCart } className="btn btn-primary my-5">Agregar al carrito</button>
  </>
  )
}
