/**  Recordemos que estoy trabaando shop como una carpeta simplemente, no es una ruta,
 * por lo tanto esta pagina corresponde a http://localhost:3000/cartempty
 * Es la pagina del carrito vacio
 */

import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";

export default function CartEmptyPage() {
  return (
    <div className="flex justify-center items-center h-[800px]">
      <IoCartOutline size={80} className="mx-5" />

      <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold">Tu carrito está vacio</h1>
          <Link href='/' className="text-blue-500 mt-2 text-2xl">
          Regresar
          </Link>
      </div>
    </div>
  );
}