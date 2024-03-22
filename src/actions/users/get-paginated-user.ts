'use server';
/**Server action para pedir los usuarios que tenga en la base de datos y asi 
 * el admin podra verlos y cambiarle el rol a cada uno 
 */
import prisma from '../../lib/prisma';
import { auth } from "@/auth.config"

export const getPaginatedUsers = async() => {
    const session = await auth();

    if( session?.user.role !== 'admin') {
        return {
            ok:false,
            message:'Debe ser administrador'
        }
    };

    const users = await prisma.user.findMany({
        orderBy: {
            name:'desc'
        }
    });

    return {
        ok:true,
        users:users
    }

}