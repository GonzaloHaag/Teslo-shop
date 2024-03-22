
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { z } from 'zod'; //para hacer validaciones a mi objecto, por ejemplo que la contraseña tenga minimo 6 caracteres y el email sea string

import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login', //ruta para hacer mi login
    newUser: '/auth/new-account' //ruta para hacer la nueva cuenta
  },
  //necesito agregar mas informacion al usuario logueado, porque solo muestra el name,email y image
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      //el authorized tiene la informacion de la autenticacion
     console.log({ auth })
      return true;
    },
    jwt({ token, user }) {
      // console.log(params.token,params.user); //cuando me logueo, en el user llega el rol y lo que quiero agregar al usuario para luego tener acceso a todas las props
      if (user) {
        token.data = user; //si el usuario existe, lleno el token para luego pasarselo a mi session
      }
      return token;//retorno el token
    },
    session({ session, token, user }) {
      //ahora yo quiero que el token.data sea parte de mi session, porque ahi tengo los roles del usuario
      session.user = token.data as any;

      return session; //retorno la session  para luego tener acceso al rol de usuario en cualquier lado de mi app
    },
  },
  providers: [
    //los providers son google, github y todo lo que soporte next-auth y nuestras propias credenciales
    //aqui debo escribir que quiero usar mis propias credenciales personalizadas
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          //con el zod estamos validando que el email sea string y un password de minimo 6 letras
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        console.log(parsedCredentials.success);
        if (!parsedCredentials.success) {
          //si la validacion no es correcta
          return null;
        }

        //si todo sale bien tomo el email y el password, aca me llega lo que ingresaron en el formulario
        const { email, password } = parsedCredentials.data; //ESTO IMPRIME LA INFO SOLO SI LOS INPUT TIENEN EL NAME , ES SUPER IMPORTANTE PONERLE NAME A LOS INPUT

        console.log({ email, password });

        //Buscar correo --> quiero ver si el email que ingresaron coincide con alguno que tengo en mi base de datos

        const user = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase() //busco donde el campo email sea igual al email que me ingresaron en el form
          }
        });

        if (!user) return null;

        //Comparar contraseñas
        //en este punto el email existe en nuestra base de datos, por lo tanto validamos el password
        //esto compara el password ingresado en el form, con el que esta en la base de datos para ese user
        //si esto no hace match, tenemos un usuario incorrecto
        if (!bcryptjs.compareSync(password, user.password)) return null;

        /**Si todo lo otro pasa, es porque el usuario existe en 
         * nuestra base de datos... Nosotros estamos negando
         */
        //Regresar usuario, pero sin el password. Para ello desestructuro el password y mando solo el resto de propiedades del user
        const { password: _, ...rest } = user;

        //si todo sale bien al ingresar se reinicia el navegador
        return rest;
      },
    }),
  ]
};
export const { signIn, signOut, auth, handlers } = NextAuth(authConfig); //esto es lo que debo exportar para luego usarlo en otros lugares de mi app
/**sigin para inicial sesion, signOut para salir. Los handlers tiene las peticiones GET Y POST que son 
 * los metodos que mi sessionProvider esta buscando
  */
