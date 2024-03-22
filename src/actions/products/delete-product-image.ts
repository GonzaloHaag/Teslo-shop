'use server';


import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');


/**Server action para eliminar las imagenes que subi de un producto, y a su vez 
 * eliminarlas tambien de cloudinary
 */

export const deleteProductImage = async( imageId:number, imageUrl:string ) => {

    if( !imageUrl.startsWith('http') ) {

        //Si la url no empieza con http, es porque no la subi yo 
        return {
            ok:false,
            error:'No se pueden borrar imagenes de filesystem'
        }

    };

    const imageName = imageUrl.split('/').pop() ?.split('.')[0] ?? '';

    /**El url de mi imagen en la base de datos es : https://res.cloudinary.com/dkjmotlhj/image/upload/v1711058051/ezdes4jzw83u4l8gjo1s.avif
     * yo estoy buscando quedarme solo con el id ezdes4jzw83u4l8gjo1s
     * Por lo que hago un split por los /
     * 
     * console.log(imageName)
     */

    //El procesamiento de cloudinary puede fallar

    try {

        await cloudinary.uploader.destroy( imageName ); //Para borrar la imagen en cloudinary

        const deletedImage = await prisma?.productImage.delete({
            where : {
                //Voy a eliminar de mi base de datos la cual el id coincida con el id que me llega por parametro
                id : imageId
            },
            //Necesito el slug del producto
            select:{
                product:{
                    select:{
                        slug:true
                    }
                }
            }
        });

        //Revalidar paths para actualizar la info --> ES CLAVE ESTO

        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${ deletedImage?.product.slug }`);
        revalidatePath(`/product/${ deletedImage?.product.slug }`);

        
    } catch (error) {

        console.log(error)

        return {
            ok:false,
            message:'No se pudo realizar la eliminacion de imagen'
        }
        
    }
    
}