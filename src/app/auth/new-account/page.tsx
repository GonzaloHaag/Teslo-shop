/**página a renderizar en /auth/new-account que va a tomar el layout especificado en la carpeta de auth*/
import { titleFont } from '@/config/fonts';
import { RegisterForm } from './ui/RegisterForm';



export const metadata = {
 title: 'New Account | Teslo Shop',
 description: 'New Account | Teslo Shop',
};

export default function AuthRegisterPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">

      <h1 className={`${titleFont.className} text-4xl mb-5`}>Nueva cuenta</h1>

     <RegisterForm />
    </div>
  );
}