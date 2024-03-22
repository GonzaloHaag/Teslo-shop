'use client'

/**Esta pagina se lanzara en caso de no existir un genero que coincida con mi base de datos, es muy bueno 
 * porque se hace del lado del cliente y nunca llega a produccion
 * Si no existe el genero buscado, lanzara mi not found personalizado
 */

import { PageNotFound } from "@/components";

export default function NotFoundGenderPage() {
  return (
    <PageNotFound />
  );
}