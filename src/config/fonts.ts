/**aca exportare las fuentes de google fonts. Esto es muy util para optimizar las fuentes
 * Aca debo exportar todas las fuentes que quiera utilizar 
 */
import { Inter,Montserrat_Alternates } from "next/font/google"; //aca importo las fuentes que quiera usar
export const inter = Inter({ subsets: ["latin"] });
export const titleFont = Montserrat_Alternates({
    /** fuente para los titulos, para utilizarla solo debo ponerlo en la etiqueta que lo quiero usar como un className
     * <h1 className={titleFont.className}></h1> titleFont porque asi lo defini aca
     */
     subsets:["latin"],
     weight:['500','700']
})