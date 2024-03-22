/**Pagina para administrar la ordenes de los demas usuarios /admin/orders */
/**  Recordemos que estoy trabaando shop como una carpeta simplemente, no es una ruta,
 * por lo tanto esta pagina corresponde a http://localhost:3000/admin/users
 */

// https://tailwindcomponents.com/component/hoverable-table
import { getOrdersByUser, getPaginatedOrders, getPaginatedUsers } from '@/actions';
import { Title } from '@/components';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';
import { UsersTable } from './ui/UsersTable';

export default async function OrdersPage() {

  //Llamada a mi server action que trae las ordenes por usuario 

  const { ok, users=[] } = await getPaginatedUsers();  //me traigo todos los usuarios, mi server action se encarga de pedirlos

  if ( !ok ) {
    redirect('/auth/login')
  }
  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
       <UsersTable users={ users } />
      </div>
    </>
  );
}