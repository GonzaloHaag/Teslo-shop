'use server';
import { auth } from '@/auth.config';
import prisma from '../../lib/prisma';

//server action para la pantalla de /orders/orderId

export const getOrderById = async( id:string ) => {
    const session = await auth(); //No quiero que entren a la ruta de /orders/idOrden sin estar logueados
    
    if( !session?.user ) {
      return {
        ok:false,
        message:'Debe estar registrado'
      }
    };

    try {
        const order = await prisma.order.findUnique({
            where: {
                id : id
            },
            //Ahora tambien quiero incluir la tabla de orderAddress y de OrderItem
            include:{
                OrderAddress:true,
                OrderItem: {
                    //de la tabla orderItem no quiero todas las columnas, solo estas:
                    select: {
                        price: true,
                        quantity: true,
                        size: true,

                        producto: {
                          select:{
                            title:true,
                            slug:true,
                            ProductImage:{
                                select:{
                                    url:true
                                },

                                take:1
                            }
                          }
                        }
                    }
                }
            }
        });

        if( !order ) throw `${ id } no existe`;

        //Si la orden no es de un usuario q no le pertenece

        if( session.user.role === 'user' ) {
            if( session.user.id !== order.userId ) {
                //significa que no es la orden del usuario logueado
                throw `${ id } no pertenece al usuario`
            }
        }

        return {
            ok:true,
           order:order        
}
        
    } catch (error) {
        console.log(error)
        return{
            ok:false,
            message:'Algo salio mal'
        }
    }
  
}