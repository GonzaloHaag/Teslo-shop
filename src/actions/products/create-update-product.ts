'use server';
import { Gender, Product, Size } from '@prisma/client';
/**Esquema de validacion para asegurarme que me este llegando en el objeto 
 * todas las propiedades que necesito
 * Esto es para la validacion en mi base de datos
 */

import prisma from '../../lib/prisma';
import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

const productSchema = z.object({
    //El id sera string, un uuid,opcional, y puede venir nulo
    id: z.string().uuid().optional().nullable(),
    slug: z.string(),
    //titulo string con 3 caracteres minimo y 255 maximo
    title: z.string().min(3).max(255),
    description: z.string(),
    //El precio lo estamos recibiendo como un string, y lo quiero guardar como un number
    price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
    inStock: z.coerce.number().min(0).transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    //El gender es una enumeracion:
    gender: z.nativeEnum(Gender)


})

//Server action que recibira un objeto que es el formulario para crear o actualizar un producto como administrador

export const createOrUpdateProduct = async (formData: FormData) => {

    const data = Object.fromEntries(formData);

    const parseProduct = productSchema.safeParse(data);

    //Dentro de parseProduct.success podremos saber si la data es correcta
    if (!parseProduct.success) {
        console.log(parseProduct.error);
        return {
            ok: false
        }
    }

    console.log(parseProduct.data); //Aca ya tendriamos la data si todo sale bien, y llega como un objeto normal


    const product = parseProduct.data;
    //Voy a reemplazar los espacios en blanco del slug por un -
    product.slug.toLowerCase().replace(/ /g, '-').trim();

    /**Para actualizar el producto en mi base de datos, necesito hacerlo mediante un $transaction.
    * Porque cuando mandemos el producto, yo voy a mandar la data + los archivos a cargar(imagenes)
    * y yo tengo que esperar que AMBAS cosas sucedan correctamente, la actualizacion +  la carga + 
    * la actualizacion en la base de datos de las imagenes.
    */

    const { id, ...rest } = product; //desestructuro el id de todas las propiedades del product

    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            let product: Product;

            const tagsArray = rest.tags.split(',').map((tag) => tag.trim().toLowerCase());

            if (id) {
                //Si tenemos un id, tengo que actualizar el producto
                product = await prisma.product.update({
                    where: {
                        id: id //donde el id sea igual al id del producto
                    },
                    data: {
                        //data a actualizar del producto
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[],
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                });


            }
            else {
                //Si no tengo el id, tengo que crear ese producto
                product = await prisma.product.create({
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
            };

            //Proceso de carga y guardado de imagenes
            //Recorrer imagenes y guardarlas

            if (formData.getAll('images')) {
                //Le mando todas las imagenes a mi funcion, que se encarga de guardarlas en cloudinary
                /**La idea es recibir [https://url.jpg,https://url.jpg,] y asi con todas las imagenes
                 * para insertar ese arreglo en mi base de datos
                 */
                const images = await uploadImagenes(formData.getAll('images') as File[]);

                if( !images ) {
                    throw new Error('No se pudo cargar las imagenes'); //estoy dispara el rollback de mi transaccion
                }

                //Si tenemos imagenes, hay que actualizar en mi base de datos

                 await prisma.productImage.createMany({
                    data:images.map((image) => ({
                        url:image!,
                        productId: product.id
                    }))
                 });

            }
            console.log({ product }) //El producto ya se creo o actualizo correctamente

            return {
                //Regreso el producto en mi transaccion de prisma

                product: product

            }
        });

        //Si todo sale bien, mi server action retornara el producto de la transaccion
        //Revalidar paths para reconstruir la pagina si algo cambio
        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${product.slug}`);
        revalidatePath(`/products/${product.slug}`); //para actualizar nuestro eccommerce



        return {
            ok: true,
            product: prismaTx.product
        }

    } catch (error) {

        return {
            ok: false,
            message: 'Revisar los logs, no se pudo actualizar'
        }

    }

};


//Funcion para enviar las imagenes a cloudinary
const uploadImagenes = async (images: File[]) => {
    try {
        //Yo quiero que la carga de imagenes se haga toda junta, asi la persona si selecciona 10 imagenes para el producto es mas facil
        const uploadPromises = images.map(async (image) => {

            try {
                 // Yo tengo la imagen como archivo, pero lo quiero transformar para subirlo a cloudinary
            const buffer = await image.arrayBuffer();

            /**Estoy convirtiendo el archivo de la imagen a un string para poder subirla facilmente a 
             * cloudinary
             */

            const base64Image = Buffer.from(buffer).toString('base64');

            return cloudinary.uploader.upload(`data:image/png;base64,${ base64Image }`).then((res) => res.secure_url );

            //Estamos pidiendo que nos regrese la url de la imagen que se subio, con el res=>res.secure_url
                
            } catch (error) {
                console.log(error);
                return null;
            }
           

        });

        //Si todo salio bien yo aca tendre mi arreglo de promesas de imagenes 
        const uploadedImages = await Promise.all( uploadPromises );
        return uploadedImages;

    } catch (error) {

        console.log(error);
        return null;

    }
}