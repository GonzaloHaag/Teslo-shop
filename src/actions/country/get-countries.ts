'use server'
/**server action para hacer la solicitud a mi base de datos para traerme todos los paises y luego
 * usar esta funcion en cualquier lado de mi app
 */

import prisma from '../../lib/prisma';

export const getCountries = async() => {
    try {
        const countries = await prisma.country.findMany({
            //los quiero ordenados por el nombre de forma ascendente
            orderBy : {
                name:'asc'
            }
        });
        
        return countries;
    } catch (error) {
        console.log(error);
        return [];
    }
}
