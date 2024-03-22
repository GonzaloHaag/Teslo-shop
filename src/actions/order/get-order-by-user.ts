'use server';

import { auth } from "@/auth.config";
import prisma from '../../lib/prisma';


//La idea es obtener las ordenes que tenga ese usuario

export const getOrdersByUser = async() => {
  
    const session = await auth();

    if( !session?.user) {
        return {
            ok:false,
            message:'Debe estar autenticado'
        }
    };

    const orders = await prisma.order.findMany({
        where:{ userId : session.user.id },
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