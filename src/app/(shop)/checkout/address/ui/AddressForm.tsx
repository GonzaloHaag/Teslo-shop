'use client'; //solo esto sera del lado del cliente, no toda la pagina

import { deleteUserAddress, setUserAddress } from "@/actions";
import { Country, UserAddress } from "@/interfaces";
import { useAddresStore } from "@/store/address/address-store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
    //aca debo crearme el tipo de dato de todos mis campos del formulario
    firstName:string;
    lastName:string;
    address:string;
    address2?:string;
    postalCode:string;
    city:string;
    country:string;
    phone:string;
    remmemberAddress:boolean; //para saber si quiere recordar la direccion, true si el checbox esta checkeado false sino
}

//debe recibir los paises para mostrarlos en el select
interface Props {
    /**La interface country tiene el id y name del pais 
     * export interface Country {
       id:string;
       name:string
     }
     */
    countries:Country[];
    userStoreAddress?:Partial<UserAddress>;
}

export const AddressForm = ({ countries, userStoreAddress={} } : Props ) => {


    const setAddress = useAddresStore((state) => state.setAddress);
    const addressStore = useAddresStore((state) => state.address);

    const { data: session } = useSession({
        //si la persona no esta autenticada la manda al login
        required : true
    });

    const router = useRouter(); //si todo sale bien quiero pasar a la pantalla siguiente 

    const { handleSubmit, register,formState:{ isValid }, reset } = useForm<FormInputs>({
        defaultValues: {
            //Leer de la base de datos, esto seran los valores por defecto, lo que tengo guardado en mi base de datos
            ...(userStoreAddress as any),
            remmemberAddress:false, //por defecto quiero que el guardar direccion no este marcado
        }
    }); //vamos a usar react-hook-form


    const onSubmit = async ( data:FormInputs ) => {
        // console.log({data})
        //aca quiero guardar la data de lo que se coloco en el form en zustand
      
       
        const { remmemberAddress, ...rest } = data;
        setAddress( rest ); //para guardar todo menos el valor de remmember

        //Yo quiero que cuando  le den a recordar Direccion, guardarla en mi base de datos
        if( remmemberAddress) {
            //llamar mi server action
            await setUserAddress( rest, session!.user.id )
        }
        else {
            //Llamar mi server action para eliminar de la base de datos la direccion, ya que no quiere recordarla
           await deleteUserAddress( session!.user.id );
        }
     
        //Si todo sale bien, quiero pasar a la otra pantalla
        router.push('/checkout')
    };

    useEffect(() => {
     //Yo quiero que al recargar el navegador, la informacion que coloco el usuario en el form no se pierda, y ya la tengo en el localStorage
     if( addressStore.firstName ) {
        //si tengo algo significa que lo completaron
        reset( addressStore );
     }
    },[ addressStore,reset ])
    return (
        <form onSubmit={ handleSubmit(onSubmit) } className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
            {/*El handleSubmit recibe la funcion de envio del formulario */}
            <div className="flex flex-col mb-2">
                <span>Nombres</span>
                <input
                    type="text"
                    className="p-2 border rounded-md bg-gray-200"
                    {...register('firstName',{ required:true })} //El register es donde se guarda la info de cada campo, entonce debemos pasarle lo que corresponda segun el input
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Apellidos</span>
                <input
                    type="text"
                    className="p-2 border rounded-md bg-gray-200"
                    {...register('lastName',{ required:true })}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección</span>
                <input
                    type="text"
                    className="p-2 border rounded-md bg-gray-200"
                    {...register('address',{ required:true })}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección 2 (opcional)</span>
                <input
                    type="text"
                    className="p-2 border rounded-md bg-gray-200"
                    {...register('address2')}
                />
            </div>


            <div className="flex flex-col mb-2">
                <span>Código postal</span>
                <input
                    type="text"
                    className="p-2 border rounded-md bg-gray-200"
                    {...register('postalCode',{ required:true })}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Ciudad</span>
                <input
                    type="text"
                    className="p-2 border rounded-md bg-gray-200"
                    {...register('city',{ required:true })}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>País</span>
                <select
                    className="p-2 border rounded-md bg-gray-200"
                    {...register('country',{ required:true })}
                >
                    <option value="">[ Seleccione ]</option>
                    {
                        countries.map((country) => (
                            <option key={country.id} value={ country.id }>{ country.name }</option>
                        ))
                    }
                </select>
            </div>

            <div className="flex flex-col mb-2">
                <span>Teléfono</span>
                <input
                    type="text"
                    className="p-2 border rounded-md bg-gray-200"
                    {...register('phone',{ required:true })}
                />
            </div>



            <div className="flex flex-col mb-2 sm:mt-1">

                <div className="inline-flex items-center mb-10">
                    <label
                        className="relative flex cursor-pointer items-center rounded-full p-3"
                        htmlFor="checkbox"
                    >
                        <input
                            type="checkbox"
                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                            id="checkbox"
                            {...register('remmemberAddress')}
                        />
                        <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="1"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                    </label>
                    <span>Recordar dirección</span>
                </div>
                
                {/*Voy a deshabilitar el boton si no me completaron todos los campos del formulario,
                obviamente los que tienen el required :true 
                Para ello usamos el isValid del useForm 
                Si es valido lo muestro, sino lo deshabilito */}
                <button type="submit"
                    // href='/checkout'
                    className={`${isValid ? 'btn-primary' : 'btn-disabled'}`}
                    disabled={ !isValid } //que dependa de si el formulario es valido o no
                    >
                    Siguiente
                </button>
            </div>


        </form>
    )
}
