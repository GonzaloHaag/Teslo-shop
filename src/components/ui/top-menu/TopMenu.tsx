'use client';
/**Menu que ira arriba de todo, use client porque voy a usar mi store */
import { titleFont } from '@/config/fonts'
import { useCartStore } from '@/store/cart/cart-store';
import { useUiStore } from '@/store/ui/ui-store'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5'

export const TopMenu = () => {

  const abrirMenu = useUiStore((state) => state.openSideMenu); //funcion que tengo en mi store para cambiar el estado del menu a true

  //me voy a traer la funcion que obtiene el total de items en mi carrito, para mostrarla en el numerito y saber la cantidad de items en el carrito 
  const totalItemsInCart  = useCartStore((state) => state.getTotalItems()); //se llama la funcion directamente con () porque no devuelve nada

  //Para no obtener un error de hidratacion

  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
     setIsLoading( true );
  },[])
  return (
    <nav className='flex px-5 justify-between items-center w-full'>
        {/*logo */}
      <div>
        <Link href={'/'}>
            <span className={`${titleFont.className} antialiased font-bold`}>Teslo</span>
            <span> | Shop</span>
        </Link>
      </div>
      {/*menu*/}
      <div className='hidden sm:block'>
        <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100' href='/gender/men'>
            Hombres
        </Link>
        <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100' href='/gender/women'>
            Mujeres
        </Link>
        <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100' href='/gender/kid'>
            Niños
        </Link>
      </div>

      {/*search, cart y menu */}
      <div className='flex items-center'>
        <Link href='/search' className='mx-2'>
            <IoSearchOutline className='w-5 h-5' />
        </Link>
        {/**Yo aca ya se cuantos productos tengo en mi carrito, por lo que puedo dirigir a la página de carrito vacio
         * si yo no tengo ningun producto. Y si tengo algo, que dirija al carrito
         */}
        <Link href={`${totalItemsInCart  > 0 && isLoading === true ? '/cart' : '/cartempty'}`} className='mx-2'>
            <div className='relative'>
                {
                  //voy a renderizar el elemento solo si ya cargaron los productos y si tengo al menos un producto en el carrito 
                  (isLoading && totalItemsInCart > 0 ) && (
                    <span className='fade-in absolute text-xs rounded-full font-bold px-1 -top-2 bg-blue-700 text-white -right-2'>{ totalItemsInCart }</span>
                  )
                }
              <IoCartOutline className='w-5 h-5' />
            </div>
        </Link>

        {/*buton para abrir menu mobile*/}
        <button className='m-2 p-2 rounded-md transition-all hover:bg-gray-100' onClick={() => abrirMenu()}>
             Menú
        </button>
      </div>
    </nav>
  )
}
