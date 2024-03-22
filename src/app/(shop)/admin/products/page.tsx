/**Pagina para administrar la ordenes de los demas usuarios /admin/orders */
/**  Recordemos que estoy trabaando shop como una carpeta simplemente, no es una ruta,
 * por lo tanto esta pagina corresponde a http://localhost:3000/admin/orders
 */

// https://tailwindcomponents.com/component/hoverable-table
import {  getPaginatedOrders, getProductsPaginationWithImages } from '@/actions';
import { Pagination, ProductImage, Title } from '@/components';
import { FormatoMoneda } from '@/utils';
import Image from 'next/image';

import Link from 'next/link';

interface Props {
  searchParams : {
    page?:string; //en searchParams.page tendre la pagina que llega por Url y hacer lo que quiera
  };
}

export default async function ProductsPage({ searchParams } : Props) {
  const pageUrl = searchParams.page ? parseInt(searchParams.page) : 1; //ya tengo aqui la pagina que llega por url, solo tengo que mandarselo a mi funcion
  //si viene lo convierto a entero, sino que sea la 1
  console.log(pageUrl);
  const { products,currentPage,totalPages } = await getProductsPaginationWithImages({ page : pageUrl }); //esto va a esperar que le mande al menos un objeto vacio, pero puedo mandarle el page y el take


  return (
    <>
      <Title title="Mantenimiento de productos" />
      <div className='flex justify-end mb-5'>
         <Link href='/admin/product/new' className='btn-primary'>
          Nuevo producto
         </Link>
      </div>
      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Imagen
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Titulo
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Precio
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Género
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Stock
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Size
              </th>
            </tr>
          </thead>
          <tbody>

            {
              products?.map((product) => (
                <tr key={product.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link href={`/product/${product.slug}`}>
                    <ProductImage
                    className='w-20 h-20 object-cover rounded' 
                    src={ product.ProductImage[0]?.url } 
                    width={80} 
                    height={80} 
                    alt={ product.title } />
                    </Link>
                  
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    <Link 
                    className='hover:underline'
                    href={`/admin/product/${ product.slug }`}>
                    { product.title }
                    </Link>
                  </td>
                  <td className="text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                    { FormatoMoneda( product.price )}
                  </td>

                  <td className="text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    { product.gender }
                  </td>

                  <td className="text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                    { product.inStock }
                  </td>

                  <td className="text-sm  text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                    { product.sizes.join(', ') } {/* Para unirlos por una coma y espacio */}
                  </td>
                </tr>
              ))
            }

          </tbody>
        </table>

        <Pagination totalPages={ totalPages } />
      </div>
    </>
  );
}