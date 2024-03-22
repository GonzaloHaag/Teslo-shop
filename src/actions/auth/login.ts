'use server';
//action para la autenticacion con next-auth
import { signIn } from '@/auth.config';
import { AuthError } from 'next-auth';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect:false,

    }); 

    return 'Success'
  } catch (error) {
      
    return 'CredentialsSignIn'
    

  }
};


//OTRA ALTERNATIVA DE SERVER ACTION PARA EL LOGIN --> MAS FACIL, ES LA QUE USAMOS EN EL REGISTER 

export const login = async( email:string,password:string ) => {
   try {

    await signIn('credentials',{ email, password }); //le mando la data de email y password que me llega por parametro para iniciar sesion

    return {
      ok:true
    }
    
   } catch (error) {
     console.log(error);

     return {
      ok:false,
      message:'No se pudo iniciar sesión'
     }
   }
}