'use client'; //porque voy a usar useState para el cambio de imagen al hacer hover
import { Product } from "@/interfaces";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


interface Props {
    product:Product; //recibo el producto de tipo Product que tiene description imagen y mas
}

export const ProductoGridItem = ({ product } : Props) => {

    const [ mostrarImagen,setMostrarImagen ] = useState( product.images[0]) ; //en la posicion 0 esta la primer imagen, en product.images[1] esta la segunda a mostrar cuando se hace hover


    const imagenOnMouseEnter = () => {
        //funcion para que al hacer hover que entra el cursor setear mi estado y que muestre la otra imagen
        setMostrarImagen(product.images[1]);
    }
    const imagenOnMouseLeave = () => {
        //funcion para que cuando saco el cursor, vuelva a mi otra imagen original
        setMostrarImagen( product.images[0] );
    }
  return (
    <div className="rounded-md overflow-hidden fade-in"> {/*la clase fade in me la cree yo en globals.css */}
    <Link href={`/product/${ product.slug }`}>
    {/*el componente image ya se encarga de cargar las imagenes con un lazy loading y las optimiza */}
    <Image 
    //    src={`/products/${ product.images[0] }`} 
       src={`/products/${ mostrarImagen }`}
       alt={ product.title }
       className="w-full object-cover rounded"
       width={ 500 }
       height={ 500 }
       onMouseEnter={ imagenOnMouseEnter }
       onMouseLeave={ imagenOnMouseLeave }
        />
    </Link>
        <div className="p-4 flex flex-col">
          <Link href={`/product/${ product.slug }`} className="hover:text-blue-600">
            { product.title }
          </Link>
          <span className="font-bold">${ product.price }</span>
        </div>
    </div>
  )
}
