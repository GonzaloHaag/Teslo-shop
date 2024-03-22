'use client'; //porque vamos a usar next-auth


import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/actions";
import { IoInformationOutline } from "react-icons/io5";
import { useEffect } from "react";

/**LA IDEA ES QUE LAS PÁGINAS NO SEAN GENERADAS DEL LADO DEL CLIENTE, SOLO 
 * EL COMPONENTE QUE LO NECESITA
 */
export const LoginForm = () => {
    const [state, dispatch] = useFormState(authenticate, undefined); //el estado inicial sera undefined
    useEffect(() => {
        if( state === 'Success' ) {
            //esto significa que pudo iniciar sesion, entonces lo dirijo a la home
            //yo estoy manejando estos return en el action de login
            window.location.replace('/'); //con esto logramos que mi app haga un refresh y me actualize mi sideBar sin recargar el navegador manualmente
        }
    },[state])
    return (
        <form action={dispatch} className="flex flex-col">

            <label htmlFor="email">Correo electrónico</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="email"
                name="email" //ES SUPER IMPORTANTE PONER LOS NAME PORQUE VIAJAN HACIA EL FORMULARIO
            />


            <label htmlFor="email">Contraseña</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="password"
                name="password" //ES SUPER IMPORTANTE PONER LOS NAME PORQUE VIAJAN HACIA EL FORMULARIO
            />
            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {
                    state==='CredentialsSignIn' && (
                        //Defini arrojar un CredentialsSignIn en caso de que haya un error, entonces manejo eso tirando un error
                        <div className="mb-2 flex items-center">
                            <IoInformationOutline className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">Las credenciales no son correctas</p>
                        </div>
                    )}
            </div>

            <LoginButton />

            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/new-account"
                className="btn-secondary text-center">
                Crear una nueva cuenta
            </Link>

        </form>
    )
};

function LoginButton() {
    //funcion para modificar el boton de ingresar de acuerdo al estado de la sesion, si esta pendiente lo desabilita
    const { pending } = useFormStatus(); // si el estado es pending, quiero deshabilitar mi button

    return (
        <button
            type="submit"
            className={`${ pending ? 'btn-disabled':'btn-primary' }`} //2 clases personalizadas que estan en globals.css
            disabled={pending} //el disabled dependera del valor del pending
            >
            Ingresar
        </button>
    );
}
