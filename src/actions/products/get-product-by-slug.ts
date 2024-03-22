'use server';
import { redirect } from 'next/navigation';
/**recordemos que todas las funciones dentro de actions, se encargan de solicitar el producto 
 * a la base de datos
 * Y SIEMPRE SON DEL LADO DEL SERVIDOR
 */
import prisma from '../../lib/prisma';

export const getProductBySlug = async ( slug:string ) => {
    try {
        const productBySlug = await prisma.product.findFirst({
            //no olvidarse incluir el productImage, porque es una relacion 
            include : {
                ProductImage : true
            },
            //ahora hago la consulta, cuando el slug sea igual al slug que me llega
            where : {
                slug : slug
            }
        });

        if( !productBySlug ) {
            return null;
        }
        return {
            //necesito aplanar mi producto para tener las imagenes dentro de este objeto, me traigo todo lo que tiene el producto, y le agrego las imagenes (solo el url)
            ...productBySlug,
            images: productBySlug.ProductImage.map((image) => image.url )
        }
    } catch (error) {
        throw new Error('No se encontro el producto')
    }
}
