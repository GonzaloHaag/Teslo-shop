'use server'; //siempre server actions

import prisma from '../../lib/prisma';

export const setTransactionId = async( orderId:string, transactionId:string ) => {
     
    try {
     
        //Quiero agregarle el campo de transactionId a la tabla de order, entonces debo actualizarla
        const orderOnSaveTransactionId = await prisma.order.update({
            where: {
                id : orderId //Busco que el id que llega por parametro coincida con el id de la orden
            },
            data: {
                //La data a actualizar
                transactionId : transactionId
            }
        });

        if( !orderOnSaveTransactionId ) {
             return {
                ok:false,
                message:`No se encontro una orden con el id ${ orderId }`
             }
        };

        return {
            ok:true
        }
       
    } catch (error) {
        console.log(error);
        return{
            ok:false,
            message:'Algo salio mal'
        }
    }
}