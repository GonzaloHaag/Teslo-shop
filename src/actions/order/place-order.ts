'use server'

import { auth } from "@/auth.config";
import { Size, UserAddress } from "@/interfaces";

import prisma from '../../lib/prisma';

interface productToOrder {
    productId: string;
    quantity: number;
    size: Size
}

export const placeOrder = async (productIds: productToOrder[], address: UserAddress) => {
    //Para insertar la orden necesito el userId, que sera de la session para saber quien esta iniciado 
    const session = await auth();
    const userId = session?.user.id;

    //verificar sesion de usuario
    if (!userId) {
        return {
            ok: false,
            message: 'No hay sesion de usuario'
        }
    };

    //Obtener la informacion de los productos
    //Recordar que podemos tener 2 o más productos con el mismo ID (por la talla)

    const products = await prisma.product.findMany({
        where: {
            /**Aca vamos a buscar en la tabla de productos, todos los productos cuyo ID, exista 
             * en el arreglo de productsIds
             */
            id: {
                in: productIds.map((p) => p.productId)
            }
        }
    });

    //    console.log({ products })

    //Calcular los montos
    const totalItemsInOrder = productIds.reduce((count, product) => count + product.quantity, 0);


    //totales de impuesto,subtotal y total

    const { total, subTotal, impuesto } = productIds.reduce((totals, item) => {
        /**el total,subTotal e impuesto arrancaran en 0 */
        const productQuantity = item.quantity; //cantidad del producto que estamos llevando 
        const product = products.find((p) => p.id === item.productId); //esto regresa el producto o undefined

        if (!product) {
            throw new Error(`${item.productId} no existe `)
        }

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.impuesto += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;

    }, { total: 0, subTotal: 0, impuesto: 0 });

    console.log({ total, subTotal, impuesto })

    //Crear la transaccion a la base de datos

    try {
        /**Lo lindo de prisma $transaction es que devuelve todos los valores actualizados, y 
         * si alguno falla, cae en el catch
         */
        const prismaTransaction = await prisma.$transaction(async (tx) => {
            //1. Actualizar el stock de los productos basado en lo que se esta llevando
            const updateProductsPromises = products.map((product) => {

                //Acumulo la cantidad del producto que estoy llevando
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => item.quantity + acc, 0);

                if (productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida `);
                }

                return tx.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        //yo necesito bajar el campo inStock
                        /**Esto no se debe hacer, porque si dos personas estan llevando lo mismo al mismo tiempo, el campo
                         * de product.inStock sera viejo
                         * inStock:product.inStock - productQuantity --> LE RESTAMOS LO ACUMULADO de los productos
                         */
                        inStock: {
                            decrement: productQuantity, //le decremento la cantidad del producto que acumule arriba
                        }
                    }
                })
            });

            const updatedProducts = await Promise.all(updateProductsPromises);

            //Verificar que no haya valores negativos en el stock
            updatedProducts.forEach((producto) => {
                if (producto.inStock < 0) {
                    throw new Error(`${producto.title} no tiene stock suficiente`)
                }
            });

            //2. Crear la orden ( encabezado y detalles )

            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: totalItemsInOrder,
                    subTotal: subTotal,
                    tax: impuesto,
                    total: total,

                    OrderItem: {
                        //esto lo sacamos de nuestro productIds
                        createMany: {
                            data: productIds.map((productId) => ({
                                quantity: productId.quantity,
                                size: productId.size,
                                productId: productId.productId,
                                price: products.find((producto) => producto.id === productId.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            });

            //Validar si el price es 0

            //3. Crear la direccion de la orden , que llega por parametro

            const { country, ...restAddress } = address;
            //Para sacar el country de las propiedades de address
            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress, //mando todas estas propiedades
                    countryId: country,
                    orderId: order.id, //orden creada anteriormente

                }
            });

            return {
                //Aca podemos retornar lo que queramos si todo sale bien
                order: order,
                orderAddress: orderAddress,
                updatedProducts: updatedProducts,
            }

        });

        return {
            ok:true,
            order:prismaTransaction.order,
            prismaTx:prismaTransaction
        }
    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }




}