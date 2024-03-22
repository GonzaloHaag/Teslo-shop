'use client';

import { placeOrder } from "@/actions";
import { useAddresStore } from "@/store/address/address-store";
import { useCartStore } from "@/store/cart/cart-store";
import { FormatoMoneda } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const PlaceOrder = () => {

    const router = useRouter();
    const [loader, setLoader] = useState(false);
    const [orderColocada,setOrderColocada] = useState(false); //Yo no quiero que la persona cree 2 ordenes iguales dandole doble click al boton de crear Orden, entonces necesito esto
    const [errorMessagge,setErrorMessagge] = useState('');
    const address = useAddresStore((state) => state.address);

    const getOrderSummary = useCartStore((state) => state.getSummaryInformation()); //esta funcion ya me retorna todo lo que necesito para la orden

    const cart = useCartStore( (state) => state.productsInCart ); //para mandarlos a la orden

    const clearCart = useCartStore((state) => state.limpiarCarrito);

    useEffect(() => {
        //Esto siempre, para evitar errores de hidratacion. True cuando termina de cargar
        setLoader(true);
    }, []);


    const onOrderColocada = async() => {
        //Para evitar que se creen 2 ordenes al darle doble click al boton de colocar orden
       setOrderColocada( true );

       const productsToOrder = cart.map((product => ({
        //este objeto voy a mandar a mi server action para la orden
          productId:product.id,
          quantity:product.quantity,
          size:product.size,
       })))
      
       console.log({ address,productsToOrder }); //Lo que quiero mandarle a mi server action (funcion)


       //Llamada al server action

       const resp = await placeOrder( productsToOrder,address );
       console.log({resp});

       if( !resp.ok ) {
        //esto caera en el catch, ya que alli retorno un return{ok:false,message:'no tiene inventario'}

        setOrderColocada( false );

        setErrorMessagge( resp.message );

        return;

       };

       //Si paso aqui, todo salio bien, limpiamos carrito y redireccionamos a la persona

      clearCart(); //llamo a mi server action que pasa el carrito a un arreglo vacio
      
      router.replace(`/orders/${ resp.order?.id }`); //dirijo a la persona a la orden creada con el id
    }

    if (!loader) {
        return <p>Cargando...</p>
    }
    return (
        <div className="bg-white rounded-xl shadow-xl p-7 flex flex-col justify-center">
            {/*Aca voy a mostrar lo que se relleno en el formulario de direccion de entrega */}
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>Código postal: {address.postalCode}</p>
                <p>{address.city},{address.country}</p>
                <p>{address.phone}</p>
            </div>
            {/**divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />
            <h2 className="text-2xl mb-2">Resumen de la orden</h2>
            <div className="grid grid-cols-2 gap-5">
                <span>No. Productos</span>
                <span className="text-right">{getOrderSummary.itemsInCart === 1 ? '1 artículo' : getOrderSummary.itemsInCart + ' artículos'} </span>
                <span>Subtotal</span>
                <span className="text-right">{FormatoMoneda(getOrderSummary.subTotalPriceProducts)}</span>
                <span>Impuestos (15%)</span>
                <span className="text-right">{FormatoMoneda(getOrderSummary.impuestos)}</span>
                <span className="mt-5 text-2xl font-bold">Total:</span>
                <span className="text-right mt-5 text-2xl font-bold">{FormatoMoneda(getOrderSummary.totalPrice)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
                <p className="mb-5">
                    <span className="text-xs">Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">póliticas de privacidad</a></span>
                </p>

                <p className="text-red-500">{ errorMessagge }</p>
                {/*aca voy a crear la orden */}
                <button className={`${ orderColocada ? 'btn-disabled' : 'flex btn-primary justify-center'}`}
                 onClick={ onOrderColocada }>
                    Colocar orden
                </button>
            </div>
        </div>
    )
}
