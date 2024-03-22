/** pagina de error en caso de que la categoria no exista el slug del producto, este not found es solo por 
 * si no existe un producto
*/

import { PageNotFound } from "@/components";

export default function NotFoundCategoryPage() {
  return (
    <PageNotFound />
  );
}