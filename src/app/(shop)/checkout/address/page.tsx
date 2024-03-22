/**  Recordemos que estoy trabaando shop como una carpeta simplemente, no es una ruta,
 * por lo tanto esta pagina corresponde a http://localhost:3000/checkout/address
 */
import { Title } from '@/components';
import { AddressForm } from './ui/AddressForm';
import { getCountries, getUserAddress } from '@/actions';
import { auth } from '@/auth.config';

export default async function AddressPage() {

  //llamo a mi server action que se encarga de hacer la solicitud a mi base de datos para traer los paises 
  const countries = await getCountries();

  const session = await auth();

  if( !session?.user ) {
   //si no tiene una session
   return (
   <h3 className='text-5xl'>500 - No hay sesion usuario</h3>
   )
  }

  const userAddress = await getUserAddress( session.user.id ) ?? undefined;

  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">
      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        
        <Title title="Dirección" subtitle="Dirección de entrega" />
        {/*El form solo del lado del cliente */}
        <AddressForm countries={ countries } userStoreAddress={ userAddress }  />

      </div>




    </div>
  );
}
  