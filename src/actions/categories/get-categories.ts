/**La idea es pedir las categorias que tengo en mi base de datos */
'use server';

import { auth } from '@/auth.config';
import prisma from '../../lib/prisma';
import { redirect } from 'next/navigation';

export const getCategories = async() => {

    const session = await auth();

    if( session?.user.role !== 'admin' ) {
        redirect('/login')
    }

    try {

        const categories = await prisma.category.findMany({
            orderBy : {
                name:'asc'
            }
        });

        return categories; //retorno el arreglo de categorias
    
        
    } catch (error) {
        return [];
    }
}
