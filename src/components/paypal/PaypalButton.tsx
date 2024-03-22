'use client';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js" //Paquete para manejar paypal
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from '@paypal/paypal-js';
import { paypalCheckPayment, setTransactionId } from "@/actions";


interface Props {

    orderId: string;
    amount: number;

}

export const PaypalButton = ({ orderId, amount }: Props) => {

    const roundedAmount = (Math.round( amount * 100 )) / 100; //Redondemos a 2 decimales, porque paypal no acepta mas de 2 decimales luego de la coma

    const [{ isPending }] = usePayPalScriptReducer(); //para saber cuando el boton esta cargando
    if (isPending) {
        return (
            <div className="animate-pulse mb-16">
                <div className="h-11 bg-gray-300 rounded"></div>
                <div className="h-11 bg-gray-300 rounded mt-2"></div>
            </div>
        )
    };

    const createOrder = async( data: CreateOrderData, actions: any ): Promise<string> => {
        //La idea de esta funcion es generar el ID de la transaccion de paypal

        const transactionId = await actions.order.create({
            purchase_units: [
                {
                    invoice_id: orderId, //Con esto logramos que no se pueda pagar algo que ya esta pagado
                    amount: {
                        value: `${ roundedAmount }`,
                       
                    }
                }
            ]
        });

        //Todo: guardar el transactionID en mi order EN LA BASE DE DATOS
        const { ok } = await setTransactionId(orderId, transactionId);
        if (!ok) {
            throw new Error('No se pudo actualizar la orden');
        }
        console.log({ transactionId })

        return transactionId;

    };

    const onApprove = async (data: OnApproveData, actions: OnApproveActions): Promise<void> => {
        console.log('onApprove')
        const details = await actions.order?.capture();

        if (!details) return;

        await paypalCheckPayment(details.id!); //Server action para verificar el pago de paypal
    }
    return (
        <div className="relative z-0">
            <PayPalButtons className="-z-10"
                createOrder={createOrder}
                onApprove={onApprove} //SE DISPARA CUANDO EL PROCESO SALE CORRECTAMENTE
            />
        </div>

    )
}
