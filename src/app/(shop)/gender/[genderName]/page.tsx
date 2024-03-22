/** Recordemos que estoy trabaando shop como una carpeta simplemente, no es una ruta,
 * por lo tanto esta pagina corresponde a http://localhost:3000/gender/genderName
 */

import { getProductsPaginationWithImages } from "@/actions";
import { Pagination, ProductosGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";

export const revalidate = 60; //para tener una revalidacion de mi pagina cada 60 segundos

/**Yo solo quiero poder recibir la categorias de hombre, mujers o niños, cualquier otra sera dirigido a la 
 * pagina de not-found.tsx
 */

interface Props {
  //voy a recibir un objeto que tiene params.idCategory
  params : {
    genderName : string; // importante aca: el nombre del params debe ser igual al nombre de la carpeta que esta entre [], admitimos men, women, kid y unisex
  },
  //necesito saber que /?page= me llega por url
  searchParams : {
    page?:string;
  }
}
//Para generar un metadata dinamica, basada en el slug del producto:
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const gender = params.genderName;
 
  // fetch data
 // const product = await getProductsPaginationWithImages(); //info del producto
 
  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: gender,
}
}

export default async function genderNamePage({ params,searchParams } : Props) {

  const genderName = params.genderName; //aca ya tengo las categoria que me llega por parametro en la url
  
  // if(idCategoria === 'kids') {
  //   //si recibo una categoria que no quiero, lanzo la funcion de next navigation, que muestra mi archivo not-found.tsx dentro de category
  //   notFound();
  // }

  /**Necesito hacerme un array nuevo, solo con los products en los cuales el genero coincida con la url que me llega por parametro
   * asi yo muestro lo que corresponde 
   */
  const pageUrl = searchParams.page ? parseInt(searchParams.page) : 1; //ya tengo aqui la pagina que llega por url, solo tengo que mandarselo a mi funcion
  //si viene lo convierto a entero, sino que sea la 1
  console.log(pageUrl);
  const { products,currentPage,totalPages } = await getProductsPaginationWithImages({ page : pageUrl, genderName : genderName as Gender }); //esto va a esperar que le mande al menos un objeto vacio, pero puedo mandarle el page y el take
  // console.log({ currentPage,totalPages }); me va a dar que estoy en la primer pagina y tengo solo 5 paginas
  /**Yo no quiero que si me mandan una pagina y no hay productos, no muestre nada, por lo que voy a
   * hacer una redireccion a la pagina 1
   */
  if( products.length === 0) {
    redirect(`/gender/${ genderName }`)
  }

  const labels:Record<string,string> =  {
     /**Para ponerle tipado a un objeto literal, utilizamos record, que inidca que el primer string sera de tal tipo 
      * y lo que le sigue : sera de string
      */
    //esto voy a querer mostrar en el titulo
    'men':'para hombres',
    'women':'para mujeres',
    'kid':'para niños',
    'unisex':'para todos'
  }
  
  return (
    <>
      <Title title={`Articulos ${ (labels)[genderName]}`} subtitle="Todos los productos" /> {/*Le mando el titulo que va arriba a la izquierda */}
      { /*aca quiero mostrar mi componente grid dependiendo la categoría */ }
      <ProductosGrid productos={ products } /> {/* le mando los productos que extrai de mi funcion en actions que se encarga de buscar por genero con where */}

      <Pagination totalPages={ totalPages } />
    </>
  );
}