/**grid de productos para todas las paginas */

import { Product } from "@/interfaces"
import { ProductoGridItem } from "./ProductoGridItem";

interface Props {
    productos: Product[]; //un arreglo de productos que defini en mi interfaces lo que tendra ese producto (description image y mucho mas)
}

export const ProductosGrid = ({ productos } : Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-10 px-5 sm:px-0">
      {
        productos.map((producto) => (
           <ProductoGridItem key={ producto.slug } product={ producto } /> /*le mando el producto a mi grid Item para que muestre lo que quiera con el product.propiedad */
        ))
      }
    </div>
  )
}
