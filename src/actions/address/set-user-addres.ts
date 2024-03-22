'use server'

import { UserAddress } from "@/interfaces";
import prisma from "@/lib/prisma";
//server action para llamar a mi base de datos

export const setUserAddress = async (address: UserAddress, userId: string) => {

    try {
     
        const saveAddress = await createOrReplaceAddres( address,userId );

        return {
            ok:true,
            address : saveAddress
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'no se pudo grabar la direccion'
        }
    }
};

/**Nuestra direccion tiene la relacion 1 a 1 , entonces primero debo crear el registro. Si ya tengo el registro
 * lo voy a actualizar 
 */
const createOrReplaceAddres = async ( address:UserAddress, userId: string ) => {
    try {
        //verifico si la direccion ya existe o si tengo que crearla
        const storeAddress = await prisma.userAddress.findUnique({
            where: {
                userId: userId
            }
        });

        const addressToSave =  {
         //aca relleno la data de la direccion, con lo que me llega por parametro
         userId : userId,
         address : address.address,
         address2 : address.address2,
         countryId : address.country,
         city : address.city,
         firstName : address.firstName,
         lastName : address.lastName,
         phone : address.phone,
         postalCode : address.postalCode,
        }

        //si es nulo debo crearla 
        if ( !storeAddress ) {
            const newAddres = await prisma.userAddress.create({
                data: addressToSave
            });

            return newAddres;
        };

        //Aca significa que la direccion ya existe , entonces la actualizo

        const updateAddress = await prisma.userAddress.update({
            where : {
                userId : userId
            },
            data : addressToSave
        });

        return updateAddress;

        
    } catch (error) {
        console.log(error)
        throw new Error('No se pudo grabar la direccion')
    }
}