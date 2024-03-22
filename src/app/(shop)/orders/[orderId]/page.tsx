/**  Recordemos que estoy trabaando shop como una carpeta simplemente, no es una ruta,
 * por lo tanto esta pagina corresponde a http://localhost:3000/order/idOrder
 */

import { getOrderById } from "@/actions";
import { OrderStatus, PaypalButton, Title } from "@/components";
import { FormatoMoneda } from "@/utils";
import Image from "next/image";;
import { redirect } from "next/navigation";

//voy a querer recibir el numero de orden por url

interface Props {
  params: {
    orderId: string; //ES SUPER IMPORTANTE PONER EL NOMBRE DE LA CARPETA QUE ESTA ENTRE [], sino no funcionara, en este caso es orderId
  }
}
export default async function OrdersByIdPage({ params }: Props) {

  const orderId = params.orderId;


  //Todo:llamar el server action 

  const { ok, order } = await getOrderById(params.orderId);



  if (!ok) {
    //si algo salio mal
    redirect('/')
  }

  console.log({ order })

  //Verificar orderId
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Order #${orderId.split('-').at(-1)}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/**carrito */}
          <div className="flex flex-col mt-5">

            <OrderStatus estaPagada={order?.estaPagada ?? false} /> {/*Le mandamos el valor de esta pagada */}

            {/**items */}
            {
              order?.OrderItem.map((item) => (
                <div key={item.producto.slug + '-' + item.size} className="flex mt-5">
                  <Image
                    src={`/products/${item.producto.ProductImage[0].url}`}
                    width={100}
                    height={100}
                    style={{
                      width: '100px',
                      height: '100px'
                    }}
                    alt={item.producto.title}
                    className="mr-5 rounded"
                  />
                  <div>
                    <p>{item.producto.title}</p>
                    <p>${item.price} x {item.quantity}</p>
                    <p className="font-bold">Subtotal:{FormatoMoneda(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))
            }
          </div>
          {/*checkout - Resumen de orden */}
          <div className="bg-white rounded-xl shadow-xl p-7 flex flex-col justify-center">
            {/*Aca voy a mostrar lo que se relleno en el formulario de direccion de entrega */}
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">{order?.OrderAddress?.firstName} - {order?.OrderAddress?.lastName}</p>
              <p>{order?.OrderAddress?.address}</p>
              <p>{order?.OrderAddress?.address2}</p>
              <p>Código postal: {order?.OrderAddress?.postalCode}</p>
              <p>
                {order?.OrderAddress?.city}, {order?.OrderAddress?.countryId}
              </p>
              <p>{order?.OrderAddress?.phone}</p>
            </div>
            {/**divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />
            <h2 className="text-2xl mb-2">Resumen de la orden</h2>
            <div className="grid grid-cols-2 gap-5">
              <span>No. Productos</span>
              <span className="text-right">{order?.itemsInOrder === 1 ? '1 artículo' : `${order?.itemsInOrder} artículos`}</span>
              <span>Subtotal</span>
              <span className="text-right">{FormatoMoneda(order!.subTotal)} </span>
              <span>Impuestos (15%)</span>
              <span className="text-right">{FormatoMoneda(order!.tax)} </span>
              <span className="mt-5 text-2xl font-bold">Total:</span>
              <span className="text-right mt-5 text-2xl font-bold">{FormatoMoneda(order!.total)}</span>
            </div>
            <div className="mt-5 mb-2 w-full">

              {
                /**Si la orden esta pagada, quiero ocultar el boton de paypal */
                order?.estaPagada ? (

                  <OrderStatus estaPagada={order?.estaPagada ?? false} /> /*Le mandamos el valor de esta pagada */

              )
              :
              (
              <PaypalButton
                amount={order!.total}
                orderId={order!.id} />
              )
              }

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}