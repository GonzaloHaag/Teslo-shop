'use client';
/**Menu que ira arriba de todo, use client porque voy a usar mi store */
import { titleFont } from '@/config/fonts'
import { useCartStore } from '@/store/cart/cart-store';
import { useUiStore } from '@/store/ui/ui-store'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { IoCartOutline } from 'react-icons/io5'
import { InputSearchProducts } from './InputSearchProducts';

export const TopMenu = () => {

  const pathname = usePathname();

  const abrirMenu = useUiStore((state) => state.openSideMenu); //funcion que tengo en mi store para cambiar el estado del menu a true

  //me voy a traer la funcion que obtiene el total de items en mi carrito, para mostrarla en el numerito y saber la cantidad de items en el carrito 
  const totalItemsInCart = useCartStore((state) => state.getTotalItems()); //se llama la funcion directamente con () porque no devuelve nada

  //Para no obtener un error de hidratacion

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);


  const itemsNavMenu = [
    {
      id: 1,
      name: 'Hombres',
      href: '/gender/men'
    },
    {
      id: 2,
      name: 'Mujeres',
      href: '/gender/women'
    },
    {
      id: 3,
      name: 'Niños',
      href: '/gender/kid'
    }
  ]
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
        {
          itemsNavMenu.map((itemNav) => (
            <Link key={itemNav.id} className={`m-2 p-2 rounded-md transition-all hover:bg-gray-100 ${pathname === itemNav.href && 'text-blue-600'}`} href={itemNav.href}>
              {itemNav.name}
            </Link>
          ))
        }

      </div>

      {/*search, cart y menu */}
      <div className='flex items-center'>
        <InputSearchProducts />
        {/**Yo aca ya se cuantos productos tengo en mi carrito, por lo que puedo dirigir a la página de carrito vacio
         * si yo no tengo ningun producto. Y si tengo algo, que dirija al carrito
         */}
        <Link href={`${totalItemsInCart > 0 && isLoading === true ? '/cart' : '/cartempty'}`} className='mx-2'>
          <div className='relative'>
            {
              //voy a renderizar el elemento solo si ya cargaron los productos y si tengo al menos un producto en el carrito 
              (isLoading && totalItemsInCart > 0) && (
                <span className='fade-in absolute text-xs rounded-full font-bold px-1 -top-2 bg-blue-700 text-white -right-2'>{totalItemsInCart}</span>
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
