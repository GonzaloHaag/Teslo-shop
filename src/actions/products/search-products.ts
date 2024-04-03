'use server';



import prisma from '../../lib/prisma';

export const searchProductsBdd = async( titleProduct:string ) => {

    try {

        const products = await prisma.product.findMany({
            where:{
                title: {
                    //Voy a buscar los productos que en su titulo contengan esta palabra
                    contains:titleProduct
                }
            },
            
            select:{
                //Para traer solo el titulo del producto y no todo
                title:true,
                slug:true
            },
            take: 10 //devuelvo solo los primeros 10
        });

        console.log(products)
        return {
            ok:true,
            products : products
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok:false,
            message:'Ocurrió un error al buscar el producto'
        }
    }
}

