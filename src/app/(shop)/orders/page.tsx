/**  Recordemos que estoy trabaando shop como una carpeta simplemente, no es una ruta,
 * por lo tanto esta pagina corresponde a http://localhost:3000/orders
 */

// https://tailwindcomponents.com/component/hoverable-table
import { getOrdersByUser } from '@/actions';
import { Title } from '@/components';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';

export default async function OrdersPage() {

  //Llamada a mi server action que trae las ordenes por usuario 

  const { ok, orders = [] } = await getOrdersByUser(); //devuelve un objeto, por eso desestructuro

  if (!ok) {
    redirect('/auth/login')
  }
  return (
    <>
      <Title title="Orders" />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                #ID
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Nombre completo
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Estado
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>

            {
              orders?.map((orderUser) => (
                <tr key={orderUser.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{orderUser.id.split('-').at(-1)}</td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {orderUser.OrderAddress?.firstName}
                  </td>
                  <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">

                    <IoCardOutline className="text-green-800" />
                    <span className='mx-2 text-green-800'>{orderUser.estaPagada ? 'Pagada' : 'Pendiente de pago'}</span>

                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 ">
                    <Link href={`/orders/${orderUser.id}`} className="hover:underline">
                      Ver orden
                    </Link>
                  </td>
                </tr>
              ))
            }

          </tbody>
        </table>
      </div>
    </>
  );
}