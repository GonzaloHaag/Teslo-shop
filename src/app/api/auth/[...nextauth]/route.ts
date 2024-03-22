/**Esta api a /api/auth/ corresponde porque sino no funciona el SessionProvider para obtener 
 * la session del usuario del lado del cliente
*/

import { handlers } from "@/auth.config";

export const { GET, POST } = handlers; //CUANDO HAY UNA PETICION GET PASA POR ACA, LO MISMO CON POST