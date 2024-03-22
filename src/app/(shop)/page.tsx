/**pagina a renderizar en /shop */
import { getProductsPaginationWithImages } from "@/actions";
import { Pagination, ProductosGrid, Title } from "@/components";
import { redirect } from "next/navigation";

export const revalidate = 60; //para tener una revalidacion de mi pagina cada 60 segundos

/**esta pagina corresponde a la inicial / **/
//me voy a crear una interface para recibir la pagina por url ?page=2, y mandarsela a mi funcion de actions que se encarga de paginar y mostrar desde la base de datos

interface Props {
  searchParams : {
    page?:string; //en searchParams.page tendre la pagina que llega por Url y hacer lo que quiera
  };
}
export default async  function HomePage ({ searchParams } : Props) {
  /**una vez que tengo mi action para llamar a los productos con prisma desde mi base de datos, solo llamo
 *  a la funcion
 * 
 * esta funcion recibe la pagina y el take
 */

  const pageUrl = searchParams.page ? parseInt(searchParams.page) : 1; //ya tengo aqui la pagina que llega por url, solo tengo que mandarselo a mi funcion
  //si viene lo convierto a entero, sino que sea la 1
  console.log(pageUrl);
  const { products,currentPage,totalPages } = await getProductsPaginationWithImages({ page : pageUrl }); //esto va a esperar que le mande al menos un objeto vacio, pero puedo mandarle el page y el take
  // console.log({ currentPage,totalPages }); me va a dar que estoy en la primer pagina y tengo solo 5 paginas
  /**Yo no quiero que si me mandan una pagina y no hay productos, no muestre nada, por lo que voy a
   * hacer una redireccion a la pagina 1
   */
  if( products.length === 0) {
    redirect('/')
  }
 /**Desestructuro los productos porque esa funcion devuelve un objeto */
  return (
   <>
   <Title title="Tienda" subtitle="Todos los productos" className="mb-2 px-5 sm:px-0" />
   <ProductosGrid productos={ products } />

   <Pagination totalPages={ totalPages } />
   </>
  );
}
