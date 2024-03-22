/**Componente para el selector de tallas */

import type { Size } from "@/interfaces"

interface Props {
  /* Quiero saber la talla seleccionada , recibirla */
  selectedSize?:Size;
  availableSizes: Size[]; //arreglo de tallas, ['SX','MD','XL','XXL']

  //quiero que al hacerle click a una talla, se me cambie el estado de la misma, recibo la talla y retorna void
  /**la prop onSizeChange es una función que se ejecutará cuando el usuario haga clic en un botón de talla. 
   * Esta función se encarga de cambiar el estado de la talla seleccionada (size) en el componente AddToCart utilizando setSize(size). 
   * En resumen, cuando el usuario hace clic en un botón de talla en el SizeSelector, 
   * se ejecuta la función onSizeChange que actualiza el estado de la talla seleccionada en el componente AddToCart. 
   * Esto permite mantener sincronizado el estado de la talla entre los dos componentes y asegura que la información seleccionada por el usuario esté disponible para el componente principal.*/
  onSizeChange : ( size:Size ) => void;
}
export const SizeSelector = ({ selectedSize, availableSizes, onSizeChange } : Props) => {
  return (
    <div className="my-5">
       <h3 className="font-bold mb-4">Tallas disponibles:</h3>

       <div className="flex ">
         {
          availableSizes.map((size) => (
            //mostrare un boton por cada talla, aca ya se la talla seleccionada
           <button 
           onClick={() => onSizeChange( size ) } //le mando la talla a mi funcion, que luego cambia el estado en AddToCart
           key={size} className={
          `mx-2 hover:underline text-xl ${ size === selectedSize && 'underline' }` //voy a subrayar solo si la talla seleccionada que me mandan es igual al size que estoy recorriendo
           }>
            { size }
            </button>
          ))
         }
       </div>
    </div>
  )
}
