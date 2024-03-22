'use client';
import { login, registerUser } from '@/actions';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
/**formulario para crear nueva cuenta del lado del cliente
 * Utilizaremos npm install react-hook-form para el manejo de este formulario
 */

type FormInputs = {
    //aca van los inputs que voy a manejar 
    name: string;
    email: string;
    password: string;
}

export const RegisterForm = () => {

    const [messageError, setMessageError] = useState('');
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

    const formOnSubmit = async (data: FormInputs) => {
        setMessageError('');
        const { name, email, password } = data; //aca tengo todos los campos de mi formulario 

        console.log({ name, email, password });

        //Llamar a mi server action que recibe los campos  para crear la cuenta
        const respuesta = await registerUser(name, email, password);

        if (!respuesta.ok) {
            //esto significa que dio un error

            setMessageError(respuesta.message);
            return;
        }

        //Si todo salio bien, quiere decir que ya se creo el usuario en mi base de datos
        // es importante poner que el campo email es unico, asi aca me rechaza si se usa un email que ya esta en mi base de datos
        console.log({ respuesta })

        //en este punto todo salio bien, por lo tanto puedo iniciar sesion
        await login( email.toLowerCase(), password );
        
        window.location.replace('/'); //luego de crear la cuenta lo mando al inicio, podria mandarlo a iniciar sesion tambien
    }
    return (
        <form onSubmit={ handleSubmit( formOnSubmit ) }  className="flex flex-col">
        {/*El handleSubmit recibe la funcion si todo salio bien */}
        {/* {
          errors.name?.type === 'required' && (
            <span className="text-red-500">* El nombre es obligatorio</span>
          )
        } */}
  
  
        <label htmlFor="email">Nombre completo</label>
        <input
          className={
            `px-5 py-2 border bg-gray-200 rounded mb-5 ${ errors.name && 'outline-red-500' }`
          }
          type="text"
          autoFocus
          { ...register('name', { required: true }) }
        />
  
        <label htmlFor="email">Correo electrónico</label>
        <input
         className={
            `px-5 py-2 border bg-gray-200 rounded mb-5 ${ errors.email && 'outline-red-500' }`
          }
          type="email"
          { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) } //valido el email con una expresion regular
        />
  
        <label htmlFor="password">Contraseña</label>
        <input
          className={
            `px-5 py-2 border bg-gray-200 rounded mb-5 ${ errors.password && 'outline-red-500' }`
          }
          type="password"
          { ...register('password', { required: true, minLength: 6 }) }
        />
  
           {/*Si ocurre un error en algun campo */}
          <span className="text-red-500">{ messageError } </span>
          
        
  
        <button className="btn-primary">Crear cuenta</button>
  
        {/* divisor l ine */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>
  
        <Link href="/auth/login" className="btn-secondary text-center">
          Ingresar
        </Link>
      </form>
    )
}
