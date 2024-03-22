import React from 'react'
import { IoCardOutline } from 'react-icons/io5'


interface Props {
  estaPagada : boolean;
}
export const OrderStatus = ({ estaPagada } : Props ) => {
  return (
      <div className={  /*si la orden esta pagada, bg green sino bg red **/
        `flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5 ${ estaPagada ? 'bg-green-500' : 'bg-red-500' }`
      }>
        <IoCardOutline size={30} />

        <span className="mx-2">{ estaPagada ? 'Pagada' : 'Pendiente de pago' }</span>

      </div>
  )
}
