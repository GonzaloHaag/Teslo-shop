/**página a renderizar en /auth/login que va a tomar el layout especificado en la carpeta de auth*/
import { titleFont } from '@/config/fonts';
import { LoginForm } from './ui/LoginForm';

export default function AuthLoginPage () {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">

      <h1 className={ `${ titleFont.className } text-4xl mb-5` }>Ingresar</h1>
  {/* Vamos a renderizar el formulario solamnete del lado del cliente, no es
  recomendable generar la pagina entera */}
     <LoginForm />
    </div>
  );
}