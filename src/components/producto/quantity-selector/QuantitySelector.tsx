'use client';
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
    quantity : number; //cantidad que la persona esta seleccionando
    onQuantityChanged : ( quantity : number ) => void;
}
export const QuantitySelector = ({ quantity , onQuantityChanged } : Props) => {
  //voy a recibir la cantidad seleccionada desde el page.tsx del productSlug

  const sumarCantidad = () => {
    onQuantityChanged( quantity  + 1 );
  }
  const restarCantidad = () => {
    if( quantity > 1 ) {
      onQuantityChanged( quantity - 1);
    }
  }
  return (
    <div className="flex">
        <button onClick={ restarCantidad }>
            <IoRemoveCircleOutline size={30} />
        </button>
    <span className="w-20 mx-3 px-5 bg-gray-100 text-center text-xl rounded">{ quantity }</span>
    <button onClick={ sumarCantidad }>
            <IoAddCircleOutline size={30} />
        </button>
    </div>
  )
}
