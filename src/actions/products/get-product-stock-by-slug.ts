'use server';
/**la idea de este server actions es solo traerme un producto por el slug de mi base de datos, pero 
 * solo la propiedad del stock
 */
import prisma from '../../lib/prisma';
export const getProductStockBySlug = async ( slug:string ): Promise<number> => {
   try {
    const productStock = await prisma.product.findFirst({
        where: {
          slug : slug
        },
        select : {
            inStock:true //para traerme solo la propiedad inStock
        }
        
    });
    // ahora simplemente retorno el stock del producto
    return productStock?.inStock ?? 0; //si existe el stock devolvemelo, sino que sea 0
   } 
   catch {
    return 0;
   };

}