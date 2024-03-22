import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**me voy a crear un estado global con zustand para manejar el carrito desde el cliente,
 * y tener acceso a el mismo desde cualquier parte de mi app
 * manejador de estados globales con zustand npm install zustand
 */
interface State {
  //interface de como va a lucir mi estado y todo lo que quiero dentro del mismo
  productsInCart: CartProduct[]; //voy a tener los productos en el carrito, un array
  //metodos para modificar este productsInCart

  addProductToCart: (product: CartProduct) => void;

  //funcion para obtener cantidad de productos en carrito para mostrar el numero 
  getTotalItems: () => number;

  //funcion para obtener el resumen de la orden, la idea es obtener la cantidad de articulos, el subtotal y los impuestos del 15%
  getSummaryInformation: () => {
    subTotalPriceProducts: number;
    impuestos: number;
    totalPrice: number;
    itemsInCart: number;
  }

  //funcion para actualizar la cantidad del producto desde el carrito 

  updatedQuantityProduct: (product: CartProduct, quantity: number) => void;

  //funcion para remover el producto entero del carrito 

  removeProductInCart: (product: CartProduct) => void;

  //Funcion para limpiar carrito 
  limpiarCarrito: () => void;
}

export const useCartStore = create<State>()(
  /**Yo quiero hacer persistente mi estado del carrito, guardarlo en el LOCALSTORAGE
   * Para que al reiniciar la pagina no se pierda, para ello utilizamos el persiste de 
   * zustand/middlewares
   */
  persist(
    (set, get) => ({
      //el create sera de tipo State, que es la interface que defini, y el set es para modificar los estados 
      productsInCart: [],
      //metodos
      getTotalItems: () => {
        const { productsInCart } = get();
        /*
        tengo que barrer mi arreglo y contar la cantidad que tengo de cada producto 
        Mi valor inicial sera 0, el reduce permite recorrer todos los elementos.
        El total seria el valor inicial actualmente y luego tendriamos la iteraccion que estamos haciendo en el carrito(item)
        y voy a retornar el total +  la cantidad del item
        Entonces la primera vez el total es 0, y supongamos que la cantidad del item es 3, retorna 3 y asi sucesivamente
        Ese 3 sera el nuevo valor inicial para la segunda iteraccion, entonces se va acumulando, es muy 
        util para estos caso de acumular
       */
        return productsInCart.reduce((total, item) => total + item.quantity, 0);
      },
      getSummaryInformation: () => {
        const { productsInCart } = get();
        //lo voy acumulando con + subtotal y el valor inicial es 0
        const subTotalPriceProducts = productsInCart.reduce((subTotal, item) => (item.price * item.quantity) + subTotal, 0);
        const impuestos = subTotalPriceProducts * 0.15; //le saco el 15% a ese subototal

        const totalPrice = subTotalPriceProducts + impuestos; //ahora hago subtotal +  los impuestos para sacar el precio total

        //obtener cantidad de productos que estoy llevando 
        const itemsInCart = productsInCart.reduce((total, item) => total + item.quantity, 0);

        return {
          //aca retorno todo para luego usarlo 
          subTotalPriceProducts, impuestos, totalPrice, itemsInCart
        }
      },
      addProductToCart: (product: CartProduct) => {
        //aca hago la logica de agregar el producto al carrito , que basicamente es llenar el array de productsInCart
        const { productsInCart } = get(); //aca tengo todos los productos que tengo en mi carrito de compras

        /**
         * 1.Revisar si el producto existe en el carrito con la talla seleccionada
         * Para eso hago un find, y si existe me salgo
         */
        const productExistToCart = productsInCart.find((item) => item.id === product.id && item.size === product.size); //Si esto es true, quiere decir que ya existe, por lo tanto incremento la cantidad
        if (!productExistToCart) {
          //si el producto no esta en el carrito 
          set({
            //utilizamos el set, me traigo todo lo que tiene el carrito, y ademas le agrego el producto que mandan por parametro
            productsInCart: [...productsInCart, product],
          })
          return;
        }

        //si el producto ya existe por talla , debo aumentar la cantidad del mismo 
        const updatedQuantityProductInCart = productsInCart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            //esto significa que es el item que quiero actualizar, por lo que debo regresar todo el item con sus propiedades, pero la cantidad incrementada
            return {
              ...item,
              quantity: item.quantity + product.quantity
            }
          };
          return item;
        });

        set({ productsInCart: updatedQuantityProductInCart }); //seteo el arreglo con mi arreglo, para tener la cantidad actualizada

      },

      updatedQuantityProduct: (product: CartProduct, quantity: number) => {
        /**La idea es recibir el producto al tocar el signo de incrementar o decrementar la 
         * cantidad y el quantity sera el nuevo valor de la cantidad
         */
        //  console.log({product,quantity})
        const { productsInCart } = get();
        //me armo un nuevo arreglo con la cantidad actualizada
        const updatedCartProducts = productsInCart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            //esto quiere decir que es el producto que quiero actualizar la cantidad
            return {
              //aca retorno todo el item con sus propiedas, pero la cantidad sera la que me manden por parametro a la funcion
              ...item,
              quantity: quantity
            }
          };
          return item; //si no es el articulo retorno el mismo

        });
        //mi array de updatedCartProducts ya tiene los items con su cantidad actualizada, entonces debo setear el valor del carrito original
        set({ productsInCart: updatedCartProducts });
      },

      removeProductInCart: (product: CartProduct) => {
        //debo hacer un filter para excluir ese producto del array de los productos en carrito
        const { productsInCart } = get();
        //no debe coincidir, asi me lo elimina del array, !OJO! DEBE SER UN || NO &&, porque sino borrara ambos
        const removeProduct = productsInCart.filter((item) => item.id !== product.id || item.size !== product.size);

        set({ productsInCart: removeProduct }) //seteo mi nuevo array para que me lo elimine
      },
      limpiarCarrito: () => {
        set({ productsInCart: [] }) //lo seteo a un string vacio
      }

    }),
    {
      name: 'shopping-cart', //nombre para guardarlo en el localStorage, seria como la clave con lo que guardaremos el array de los productos en carrito
    }
  )
)