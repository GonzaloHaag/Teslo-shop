'use client';
/**La idea es que este componente no se revalide cada tanto, lo demas sera construido de forma estatica
 * Esto es porque el stock puede variar bastante, lo demas no
 */

import { getProductStockBySlug } from '@/actions';
//sera del lado del cliente porque el stock no quiero que se revalide cada 7 dias, sino cada mucho menos

import { titleFont } from '@/config/fonts'
import { useEffect, useState } from 'react';

interface Props {
    slug: string; //ACA ME LLEGA EL SLUG URL desde el page
}

export const StockLabel = ({ slug }: Props) => {
    //aca debo llamar a mi server action mediante un useEffect que busca el stock del producto
    const [stock, setStock] = useState(0); //para manejar el estado
    const [isLoading, setIsLoading] = useState(true);
   
    useEffect(() => {
        const getProductStock = async () => {
            //llamar a mi serverAction
            const inStock = await getProductStockBySlug(slug);
            setStock(inStock); //lo seteo porque lo de arriba me devuelve el stock
            setIsLoading(false); //porque ya termino de cargar mi stock
        }
        getProductStock();
    }, [ slug ]);
    return (
        <>
        
            {
            /*La idea es crear un skeleton mientras el stock se carga */
                isLoading ? (
                    <h1 className={`${titleFont.className} antialiased font-bold text-md bg-gray-200 animate-pulse`}>
                        &nbsp;
                    </h1>
                )
                    :
                    (
                        <h1 className={`${titleFont.className} antialiased font-bold text-md`}>
                            Stock: {stock}
                        </h1>
                    )
            }
        </>

    )
}
