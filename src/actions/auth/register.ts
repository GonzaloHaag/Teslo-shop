'use server';
/**Server action para el formulario de crear Cuenta, es otra alternativa de tratar la autenticacion */

import prisma from '../../lib/prisma';
import bcryptjs from 'bcryptjs';
export const registerUser = async( name:string,  email:string ,password:string ) => {
      try {
         
        //para crear el usuario hago el await a prisma con lo que me llegue por parametro
        const user = await prisma.user.create({
            data:{
                //aca relleno los campos con lo que me llega por parametro
                name:name,
                email:email.toLowerCase(),
                password:bcryptjs.hashSync( password ), //recordar encriptar el password
            },
            //yo no quiero regresar el password del usuario, eso no es correcto, entonces selecciono todos los campos menos el password:
            select:{
                id:true,
                name:true,
                email:true
            }
        });

        return {
            ok:true,
            user:user,
            message:'Usuario creado'
        }
        
      } catch (error) {
        console.log(error);
        return {
            ok:false,
            message:'No se pudo crear el usuario'
        }
      }
}