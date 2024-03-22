/**Voy a guardar la direccion de la persona en zustand, para tenerla guardada globalmente */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {

    address: {
        //todos los campos de mi formulario
        firstName: string;
        lastName: string;
        address: string;
        address2?: string;
        postalCode: string;
        city: string;
        country: string;
        phone: string;
    }

    //Metodos
   setAddress: (address:State['address']) => void;
}

export const useAddresStore = create<State>()(
    //para guardar la info en el localStorage, necesitamos usar el persist de zustand (middleware)
    persist(
        (set, get) => ({
            address: {
                //por defecto todos arrancaran vacios
                firstName: '',
                lastName: '',
                address: '',
                address2: '',
                postalCode: '',
                city: '',
                country: '',
                phone: '',
            },

            setAddress : ( address:State['address']) => {
               set({ address }); //lo seteo con el address que me llega como argumento
            },
        }),
        {
            name: 'address-information' //con este nombre se guardara la informacion en el localStorage
        }
    )

)