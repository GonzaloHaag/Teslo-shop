'use server';

import prisma from "@/lib/prisma";

//Server action para eliminar la direccion de la base de datos en caso de que el usuario no le de a recordar eleccion

export const deleteUserAddress = async( userId:string) => {
    try {
        const deleteUserAddress = await prisma.userAddress.delete({
            where : {
                userId : userId
            }
        });
        return {
            ok:true,
            message:'user address eliminada correctamente'
        }
    } catch (error) {
        console.log(error)
        return {
            ok:false,
            message:'No se pudo eliminar el user address'
        }
    }
}