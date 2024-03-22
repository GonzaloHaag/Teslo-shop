'use client';
import { generatePaginationNumbers } from "@/utils";
import Link from "next/link";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

//voy a recibir la cantidad de paginas que quiero mostrar
interface Props {
  totalPages: number;
}
export const Pagination = ({ totalPages }: Props) => {

  /** console.log(Array.from({ length: totalPages },(_i,index) => (
 index + 1 --> Si yo pongo index, arrancara desde el 0
 Me creo un array con el numero de paginas y lo itero para crear un item por cada numero de pagina
  ))); */

  const pathname = usePathname();
  console.log(pathname); //me da la ruta donde estoy parado /
  const searchParams = useSearchParams(); //esto me sirve para capturar el /?page=2
  
  const pageString = searchParams.get('page') ?? 1; //esto sera un string o un 1
  let currentPage = isNaN( Number(pageString))? 1 : Number(pageString);
  /**Si el pageString no es numero, regreso un 1, sino el page string convertido a numero 
   * esto tambien sirve por si me mandan un string como abc en page
  */

  if( currentPage < 1  || isNaN( Number(pageString) )) {
    //si me mandan un /?page=abc quiero sacarlo , no quiero mostrar nada, lo redirijo
    redirect( pathname );
  }
  console.log({ searchParams, currentPage });

  const allPages = generatePaginationNumbers(currentPage, totalPages);  //esta funcion devuelve el arreglo para el total de paginas

  console.log(allPages)

  const createPageUrl = (pageNumber: number | string) => {
    //la idea es crear nuestra navegacion, voy a crear la URL que yo quiera
    const params = new URLSearchParams(searchParams);
    if (pageNumber === '...') {
      //esto solo regresa el url en el cual me encuentro, pero sube la pantalla hasta arriba
      return `${pathname}?${params.toString()}`
    }
    if (Number(pageNumber) <= 0) {
      return `${pathname}`; //href="/" lo dirijo a lo que venga en el pathname
    }
    if (Number(pageNumber) > totalPages) {
      //ESTO ES CUANDO HACEMOS CLICK EN EL NEXT DE PAGINA SIGUIENTE, esto le dice que se quede en la ruta en la que se encuentra
      return `${pathname}?${params.toString()}`
    }

    //si no pasa nada de lo anterior 
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  }
  return (
    <div className="flex text-center mt-10 mb-32 justify-center">
      <nav aria-label="Page navigation example">
        <ul className="flex list-style-none">
          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(currentPage - 1)}>
              <IoChevronBackOutline size={30} />
            </Link>
          </li>
          {
            allPages.map((page,index) => (
              <li className="page-item" key={index}>
                <Link
                  className={`page-link relative block py-1.5 px-3 border-0
                  outline-none transition-all duration-300 rounded
                 text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none
                 ${ currentPage === page ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white' : ''}
                 `}
                  href={ createPageUrl( page )}>
                  { page }
                </Link>
              </li>
            ))
          }
          <li className="page-item">
            <Link
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(currentPage + 1)}>
              <IoChevronForwardOutline size={30} />
            </Link>

          </li>
        </ul>
      </nav>
    </div>
  )
}
