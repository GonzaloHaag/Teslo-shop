'use server';

import { auth } from "@/auth.config";
import prisma from '../../lib/prisma';


//La idea es obtener las ordenes  de los demas usuarios

export const getPaginatedOrders = async() => {
  
    const session = await auth();

    if( session?.user.role !== 'admin' ) {
        //Si el usuario no es admin, no hago nada porque no me interesa. Yo quiero mostrar las ordenes de todos los users para el admin
        return {
            ok:false,
            message:'Debe estar autenticado'
        }
    };

    const orders = await prisma.order.findMany({
        orderBy:{
            createdAt:'asc', //Quiero las ordenes por fecha de creacion de manera ascendente
        },
        include:{
            //Quiero incluir la tabla de orderAddress
            OrderAddress:{
                //Quiero incluir esta tabla porque necesito el nombre de la persona. Me traigo solo esos campos
                select:{
                    firstName:true,
                    lastName:true
                }
            }
        }
    });

    return {
        ok:true,
        orders:orders
    }
}