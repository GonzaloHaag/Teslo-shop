'use client';
import { searchProductsBdd } from '@/actions'
import { useUiStore } from '@/store/ui/ui-store';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5'

export const InputSearchProducts = () => {


    const [titleSearchProduct,setTitleSearchProduct] = useState('');
    const cerrarMenu = useUiStore((state) => state.closeSideMenu); //funcion que tengo en mi store para cambiar el estado del menu a false

    const guardarEscritoEnInput = (e:ChangeEvent<HTMLInputElement>) => {
       
        setTitleSearchProduct( e.target.value )
    }
    const [productsBuscados,setProductsBuscados] = useState([{
        title:'',
        slug:'',
    }]);
    const getSearchProducts = async() => {
    const { products } = await searchProductsBdd( titleSearchProduct );
    setProductsBuscados( products || [] );
    }

    const inputReset = () => {
        setTitleSearchProduct('');
        cerrarMenu();
    }

    useEffect( () => {
      getSearchProducts();
    },[ titleSearchProduct ]);
  return (
    <div className='mt-14 relative'>
         <input value={ titleSearchProduct } onChange={ guardarEscritoEnInput } type="text" placeholder="Buscar"
                        className="w-full bg-gray-50 rounded pl-10 py-2 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
                    />
          <IoSearchOutline size={20} className="absolute top-3 left-2" />
          {
            titleSearchProduct !== '' && (
                <div className='absolute w-full bg-white top-12 rounded min-h-full overflow-y-clip z-10 flex flex-col gap-y-5 shadow-md'>
                {
      
                  productsBuscados.length === 0  && titleSearchProduct!== '' ? (
                      <p className='text-center text-sm mt-5'>No se encontraron resultados</p>
                  )
                  :
                  (
                      productsBuscados.map((product) => (
                          <Link onClick={ inputReset } href={`/product/${ product.slug }`} key={product.title} className='border-b-2 border-b-gray-200 hover:bg-gray-400 cursor-pointer p-2 rounded'>
                              { product.title }
                          </Link>
                          
                      ))
                  )
                }
                </div>
            )
          }
         
   </div>
  )
}
