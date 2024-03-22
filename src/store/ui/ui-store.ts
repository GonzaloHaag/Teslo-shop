/**manejador de estados globales con zustand npm install zustand */
import { create } from 'zustand'


//interface para decir como va a lucir el state

interface State {
    /**Aca debo definir los valores y funciones que voy a usar y de que tipo son */
    isSideMenuOpen:boolean; //el estado de mi menu sera boolean, true si esta abierto false cerrado
    openSideMenu : () => void; //funcion para abrir el menu, no devuelve nada
    closeSideMenu : () => void; //funcion para cerrar menu, no devuelve nada
}

export const useUiStore = create<State>()((set) => ({ //este es el store que voy a exportar para acceder al valor global y tomar acciones dependiendo de ello

    //el create sera de tipo <State> que es mi interface
    isSideMenuOpen : false, //arrancara en false
    openSideMenu: () => set({ isSideMenuOpen: true }), //esta funcion pone el isSideMenuOpen en true
    closeSideMenu: () => set({ isSideMenuOpen: false }) //funcion que pone el isSideMenuOpen en false
}))