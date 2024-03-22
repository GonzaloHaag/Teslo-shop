'use server';

import prisma from '../../lib/prisma';
export const getUserAddress = async( userId:string ) => {
    //voy a pedir la direccion del usuario que tenga guardada con su id
   try {
     const userAddress = await prisma.userAddress.findUnique({
        where : {
            userId : userId
        }
     }) ;
     if( !userAddress ) return null;

     const { countryId,address2, ...rest } = userAddress;
     return {
        ...rest,
        country:countryId,
        address2: address2 ? address2 : '',
     };
   } catch (error) {
     console.log(error);
     return null
   }
}