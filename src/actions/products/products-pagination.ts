'use server';
import { Gender } from '@prisma/client';
/**La idea de la carpeta actions es tener todas mis acciones que van a estar conectadas con prisma 
 * mediante server actions
 * Aca debo hacer las funciones para solicitar los productos que tengo en mi base de datos y demas
 */

import prisma from '../../lib/prisma' //este es mi cliente para realizar llamadas a la base de datos

/**La idea de la paginacion del lado del servidor, es poder tener una url dinamica como /?page=2 
 * asi logro que al pasar mi link, la otra persona caera justo en esa pagina
 */
interface PaginationOptions {
    page?: number;
    take?: number;
    genderName?:Gender; //para recibir el filtro por genero
}
export const getProductsPaginationWithImages = async ({ page = 1 , take = 12 , genderName } : PaginationOptions) => {
    /**Al ser opcionales, debo asignarle un valor por defecto, y debo validar que no me esten mandando 
     * un string, porque la idea es que pueda recibir /?page=2 y yo no quiero que si la persona me manda 
     * un abc mi app se rompa
     */
     if( isNaN(Number(page))) {
        //si el page no es numero, que sea igual a 1
        page = 1
     }
     if( page < 1 ) {
        //si me pasan un 0, no quiero tenerla, que sea igual a 1
        page = 1
     }
    try {
        //1. Obtener los productos
         //como los productos tienen una relacion con productImage, yo necesito decirle que incluya el productImage
    const products = await prisma?.product.findMany({
        take:take, //para traer solo los productos que me lleguen por parametro
        /**Para realizar la paginacion, se utiliza el skip, el skip indica cuantas paginas debe saltarse
         * si pongo skip:0 le estoy diciendo que no se salte ninguna pagina
         * Entonces yo arranco en page - 1 que seria 0 * 12 = 0, arrancara en la pagina 1 
         * Si yo quiero saltarme 12 productos, el skip seria de 12
         * entonces si me pasan la pagina 3 y hago 3 - 1 = 2 * 12 = 24 , 
         * Si tengo 12 productos por pagina y me pasan la pagina 3, me estoy saltando 24 productos que serian las 2 primeras 
         * paginas, y ahi estoy cayendo en la pagina 3 --> ENTENDERLO A ESTO
         */
        skip: ( page - 1 ) * take,
        include:{
            ProductImage:{
                take:2, //que me traiga solo 2 imagenes para el producto, porque al hacer hover muestro la otra
                select:{
                    url:true //que solamente voy a usar la url del productImage
                }
            }
        },
        //filtro por genero, que el genero de la tabla sea igual al genderName que me llega
        where : {
           gender : genderName
        },
       
    });
    // 2.Obtener el total de paginas
   /* * LOGICA PARA MOSTRAR EL NUMERO TOTAL DE PAGINAS:
    * Supongamos que tengo 40 productos y tengo 10 paginas --> voy a ocupar 4 paginas, 10 productos por pagina (40 / 10)
    * Esto se complica si tenemos 41 productos, ya que utilizariamos 5 paginas porque nos quedaria un producto afuera
    * 41 / 10 --> 4.1 paginas
    * Para ello utilizamos el Math.ceil( 41 / 10 ) --> arroja 5
    * En nustro caso tenemos 12 articulos por pagina, entonces seria la cantitdad de productos / 12
    */
   

    const totalCountProducts = await prisma.product.count({
        where : {
            gender : genderName //para que incluya estos productos en el conteo
        }
    }); //aca voy a contar todos los productos que tengo
    /**El totalCountProducts me arroja 52, que es la cantidad de productos que tengo, ahora puedo hacer esa cantidad
     * divido las paginas para saber cuantas paginas voy a tener
     */
    const totalPages = Math.ceil( totalCountProducts / take );
       //aca debo retornar esos productos pero en un objeto, el problema es que tengo una relacion con el productImage
        //estoy retornando un objeto que dentro tiene el currentPage, el totalPages y los productos
       return {
        currentPage : page,
        totalPages : totalPages,
        products:products.map((product) => ({
            ...product, //Aca regreso todas las propiedades del objeto
            //ahora tengo un objeto, que regresa las imagenes como un arreglo de string
           images: product.ProductImage.map( (image) => image.url )
        }))
    }
    }
    catch(error) {
        throw new Error('No se pudieron cargar los productos')
    }
  

 
}