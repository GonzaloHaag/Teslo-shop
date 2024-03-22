'use client';

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { SessionProvider } from "next-auth/react";

//para obtener la session del lado del cliente, necesito un SessionProvider

interface Props {
    children:React.ReactNode;
}

export const Providers = ({ children } : Props) => {

  return (
    <PayPalScriptProvider options={{ 
      clientId:process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '' ,
      intent:'capture', //capturar el intento de pago
      currency:'USD', //moneda
      }}> {/*Para el pago con paypal */}
    <SessionProvider>
       { children }
    </SessionProvider>
    </PayPalScriptProvider>
  )
}

