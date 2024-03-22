'use server';

import { auth } from "@/auth.config";

import prisma from '../../lib/prisma';
import { revalidatePath } from "next/cache";

/**Server action para modificar el rol del usuario (en caso de ser admin) */

export const changeRolUser = async( id:string, role:string) => {

    const session = await auth();

    if( session?.user.role !== 'admin') {
        return {
            ok:false,
            message:'Debe ser administrador'
        }
    };

    try {

        const newRole = role === 'admin' ? 'admin' : 'user'; //Si el rol que llega es admin que sea admin, sino user

      //Quiero actualizar el rol del usuario dependiendo del select
      const user = await prisma.user.update({
        where: {
            id : id //voy a buscar que el id del usuario en mi base sea igual que el que me llega
        },
        data : {
            role : newRole //La data a actualizar es el role que me llega por parametro, q me lo mandan desde el front
        }
      });

      //Ahora necesitamos revalidar el path para que se actualize la data en tiempo real
      revalidatePath('/admin/users');

      return {
        ok:true,
        
      }
        
    } catch (error) {
        console.log(error)
        return {
            ok:false,
            message:'No se pudo actualizar el rol'
        }
    }
}