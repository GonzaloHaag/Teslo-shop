/**La idea de las semillas es que al ejecutar este archivo de node y typescript, se llene mi base de datos para tener algo con lo que 
 * trabajar y que no este vacia --> En desarrollo
 * Para ejecutar esto, necesito acceder desde la terminal a la carpeta seed con cd src/seed, y ejecutar el 
 * comando npx tsc --init que me creara un archivo tsconfig.json
 * En mi package.json me cree un script "seed": "ts-node src/seed/seed-database.ts" para que 
 * al ejecutar npm run seed me corra este archivo
 */
import { initialData } from "./seed";
import prisma from '../lib/prisma';



async function main() {
    /**El primer paso es borrar todos los registros que tenga cada tabla para dejarla limpia */
    await prisma.orderAddress.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany(); //borro todos los usuarios
    await prisma.country.deleteMany();
    await prisma.productImage.deleteMany(); //para borrar todo lo dejo en deleteMany
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

   const { categories,products,users,countries } = initialData; //me traigo las categorias y los productos
    /**El paso 2 es empezar a llenar las tablas con la informacion de prueba que queremos */

    await prisma.user.createMany({
        data:users //directamente le paso el array de mis users creados en seed.ts
    });
    //llenar la tabla de Category con varias categorias 
    const categoriesData = categories.map((category) => ({
        name : category
    }));
    // console.log(categoriesData) [{ name: 'shirts' },{ name: 'pants' },{ name: 'hoodies' },{ name: 'hats' } ]
    //ahora para crear esos campos con esos nombres de categoria , ahora tendre 4 campos dentro de la tabla Category
    await prisma.category.createMany({
        data:categoriesData
    });

    //llenar la tabla con paises 
    await prisma.country.createMany({
        data:countries, //le paso todo el array con los objetos dentro
    });

    //ahora me quiero traer las categorias que tengo en mi base de datos para saber su ID y asignarlo a un producto
    const categoriesDB = await prisma.category.findMany();
    const categoriesMap = categoriesDB.reduce((map,category) => {

        /**
         * Por cada iteraccion, la primera vez el map es un objeto vacio,
         * la segunda vez, crea la llave shirt a minuscula y esa llave va a 
         * apuntar a la categoryId
         */
         map[ category.name.toLowerCase() ] = category.id;
          return map;
    },{} as Record<string,string>) //<string=shirt,string=categoryId>
/**
 * Este es el resultado
    console.log(categoriesMap);
    {
        shirts: 'f75b1a47-d732-41ba-93f0-b9206b0398a2',
        pants: '22df6202-8f52-458f-8be6-5fe9f6364b6e',
        hoodies: '44c06277-e90d-47b5-9b3a-cc75a2b0b08b',
        hats: '4b77fb19-40a2-42c3-a332-1936b79118f9'
      }
*/

//INSERTAR PRODUCTOS EN MI BDD prodcuts viene de mi seed initial data
products.forEach(async(product) => {
    const { type, images , ...rest } = product;
    //saco el type e images y me quedo con el resto de propiedades
    const dbProduct = await prisma.product.create({
        //con esto crearemos todos los productos que esten en nuestro initialData
        data:{
            ...rest,
            categoryId:categoriesMap[type]
        }
    });

    //images --> en dbProduct ya tengo mi producto creado en la base de datos
    const imagesData = images.map((image) => ({
        //necesito tener un arreglo con la url y el productId, porque las imagenes tienen esa relacion
        url:image,
        productId: dbProduct.id
    }));

    //insertar el productImage

    await prisma.productImage.createMany({
       data:imagesData
    })

})
    
    console.log('Seed ejecutado')
}


(async () => {
    main();
})();