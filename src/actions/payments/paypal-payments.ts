'use server';

import { PaypalOrderStatusResponse } from "@/interfaces";
import { revalidatePath } from "next/cache";

/**Server actions para verificar el pago de paypal */

export const paypalCheckPayment = async (paypalTransactionId: string) => {
    console.log({ paypalTransactionId })
    const authToken = await getPaypalBearerToken();
    console.log({ authToken });

    if (!authToken) {
        return {
            ok: false,
            message: 'No se pudo obtener el token de verificacion'
        }
    };

    const resp = await verifiedPayPalPayment( paypalTransactionId, authToken );

    if( !resp ) {
        return {
            ok:false,
            message:'Error al verificar el pago'
        }
    };

    const { status,purchase_units } = resp;
    const { invoice_id } = purchase_units[0]; //invoice_id

  //En el status tengo el estado del pago
  if( status!== 'COMPLETED' ) {
    return {
        ok:false,
        message:'Aun no se ha pagado en paypal'
    }
  };
  //Realizar actualizacion en base de datos
  try {
    console.log({status,purchase_units})

    await prisma?.order.update({
        where:{
            id: invoice_id //con esto paypal identifica cual es mi orden a pagar
        },
        data:{
            estaPagada:true,
            fechaDePago: new Date(),
        }
    });

    //Revalidar el path para que next revalide el url para que se actualize el estado de mi orden en tiempo real
    revalidatePath(`/orders/${ invoice_id }`);

    return {
        ok:true
    }
    
  } catch (error) {
    console.log(error);
    return {
        ok:false,
        message:'El pago no se pudo realizar'
    }
  }
    
   
};

const getPaypalBearerToken = async (): Promise<string | null> => {

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    const PAYPAL_SECRET_ID = process.env.PAYPAL_SECRET;

    const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? '';

    const base64Token = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_ID}`,
        'utf-8'
    ).toString('base64');

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${base64Token}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
    };
    try {

        const result = await fetch(oauth2Url, {
            ...requestOptions,
            cache:'no-store'
        }).then((resp) => resp.json());

        //aca tendriamos nuestro access token

        return result.access_token;


    } catch (error) {
        console.log(error);
        return null;
    }


}

const verifiedPayPalPayment = async ( paypalTransactionId: string, bearerToken: string ):Promise<PaypalOrderStatusResponse | null> => {

    const paypalOrderUrl = `${ process.env.PAYPAL_ORDERS_URL }/${ paypalTransactionId }`
    //Verificar el pago
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${ bearerToken }`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    try {
       const response =  await fetch(paypalOrderUrl,{
        ...requestOptions,
        cache:'no-store'
       }).then((res) => res.json());

       return response;
        
    } catch (error) {
        console.log(error);
        return null;
    }

   
    
}