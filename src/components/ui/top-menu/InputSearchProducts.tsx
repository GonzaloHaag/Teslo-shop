'use client';
import { searchProductsBdd } from '@/actions'
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5'

export const InputSearchProducts = () => {


    const [titleSearchProduct,setTitleSearchProduct] = useState('');


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

    useEffect( () => {
      getSearchProducts();
    },[ titleSearchProduct ]);
  return (
    <div className='mx-2 relative'>
          <input onChange={ guardarEscritoEnInput } type='text' placeholder='Buscar' className='outline-none border-2 border-gray-200 focus:border-gray-300 py-2 indent-2 rounded' />
          <IoSearchOutline className='w-5 h-5 cursor-pointer absolute right-2 top-3' />
          <div className='absolute w-full bg-white rounded max-h-80 overflow-y-auto z-10 flex flex-col gap-y-5'>
          {
            productsBuscados.length === 0  && titleSearchProduct!== '' ? (
                <p className='text-center text-sm'>No se encontraron resultados</p>
            )
            :
            (
                productsBuscados.map((product) => (
                    <div key={product.slug} className='border-b-2 border-b-gray-200 hover:bg-gray-400 cursor-pointer p-2 rounded'>
                    <Link onClick={() => setTitleSearchProduct('')} href={`/product/${ product.slug }`} key={product.title}>
                        { product.title }
                    </Link>
                    </div>
                ))
            )
          }
          </div>
   </div>
  )
}
