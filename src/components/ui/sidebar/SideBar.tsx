'use client'; //porque estoy usando onClick y mi store
import { logout } from "@/actions";
import { useUiStore } from "@/store/ui/ui-store";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShieldOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"
import { InputSearchProducts } from "../top-menu/InputSearchProducts";

export const SideBar = () => {

    //llamo a mis funciones y estado que me cree en ui-store con zustand

    const valorMenu = useUiStore((state) => state.isSideMenuOpen); //true si esta abierto false si esta cerrado
    const cerrarMenu = useUiStore((state) => state.closeSideMenu); //funcion que tengo en mi store para cambiar el estado del menu a false

    /**y listo, con esto tengo acceso al valor y puedo mostrar lo que quiera condicionalmente */

    //Saber la session de next-auth del lado del cliente, porque quiero ocultar opciones si no tiene una session ingresada
    const { data: session } = useSession();
    //voy a tratar la data con el nombre de session, luego de hacer todo el SessionProvider y la api para que esto funcione del lado del cliente

    const userIsAuthenticated = !!session?.user;
    const isAdmin = session?.user.role === 'admin'; //true si es admin, false si no
    //sera true si tengo un usuario con sesion, falso sino. Con esto puedo ocultar opciones del menu sino esta ingresado
    return (
        <div>
            {
                /*background-black fixed claro cuando se abre el sidebar --> para ello el valor debe ser true */
                valorMenu && (
                    <div className="fixed top-0 left-0 w-screen min-h-screen z-10 bg-black opacity-30" />
                )
            }

            {
                /*blur fixed cuando se abre el sidebar */
                valorMenu && (
                    <div className="fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm fade-in" onClick={() => cerrarMenu()} />
                )
            }


            {/*side menu despegable */}
            <nav
                
                className={`
        fixed p-5 right-0 top-0 w-[80%] sm:w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300
        ${valorMenu === false && 'translate-x-full'}
        `}>
                <IoCloseOutline
                    size={50}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={() => cerrarMenu()}
                />

                {/*input */}
               <InputSearchProducts />
                {/*menu */}
                {
                    userIsAuthenticated && (
                        //si estoy autenticado
                        <>
                            <Link href='/profile'
                                onClick={() => cerrarMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
                                <IoPersonOutline size={30} />
                                <span className="ml-3 text-xl">Perfil</span>
                            </Link>
                            <Link
                                href='/orders'
                                onClick={() => cerrarMenu()}
                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
                                <IoTicketOutline size={30} />
                                <span className="ml-3 text-xl">Ordenes</span>
                            </Link>
                        </>
                    )
                }
                {
                    userIsAuthenticated && (

                        <button
                            onClick={() => logout()} //llamo a mi server action que se encarga de cerrar sesion, se debe llamar asi si o si
                            className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
                            <IoLogOutOutline size={30} />
                            <span className="ml-3 text-xl">Salir</span>
                        </button>
                    )
                }
                {
                    !userIsAuthenticated && (
                        //si no esta autenticado, debo mostrarle un link para dirijirlo a la pantalla de login
                        <Link
                            href='/auth/login'
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                            onClick={() => cerrarMenu()}>
                            <IoLogInOutline size={30} />
                            <span className="ml-3 text-xl">Ingresar</span>
                        </Link>
                    )
                }

                {
                    isAdmin && (
                        <>
                            {/*esto aparecera solo si el usuario es admin **/}
                            {/*barra separadora */}
                            < div className="w-full h-px bg-gray-200 my-10" />
                            <Link 
                            href='/admin/products' 
                            onClick={() => cerrarMenu()} 
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
                                <IoShirtOutline size={30} />
                                <span className="ml-3 text-xl">Productos</span>
                            </Link>
                            <Link
                                href='/admin/orders'
                                onClick={() => cerrarMenu()}

                                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
                                <IoTicketOutline size={30} />
                                <span className="ml-3 text-xl">Ordenes</span>
                            </Link>
                            <Link 
                            href='/admin/users' 
                            onClick={() => cerrarMenu()} 
                            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all">
                                <IoPeopleOutline size={30} />
                                <span className="ml-3 text-xl">Usuarios</span>
                            </Link>
                        </>
                    )
                }

            </nav>
        </div>
    )
}
