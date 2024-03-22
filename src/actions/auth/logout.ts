'use server';

import { signOut } from "@/auth.config";

/**La idea de este server action es hacer una funcion que 
 * se encargue de hacer el logout, para llamarla desde cualquier lado 
 * y poder salirme tocando un boton
 */
export const logout = async() => {
    await signOut(); //es solo llamar el signOut que puse en mi auth.config
}