import Image from "next/image"


interface Props {
    src?:string;
    alt:string;
    className?:React.StyleHTMLAttributes<HTMLImageElement>['className'];
    width:number;
    height:number;
    style?:React.StyleHTMLAttributes<HTMLImageElement>['style'];
}

export const ProductImage = ({ src,alt,className,width,height,style } : Props ) => {
    /**Voy a controlar que imagen del producto mostrar en la tabla del admin que maneja
     * todos los productos
     * El src de la imagen va a depender de si la tenemos o no
     */

    //Si el src viene y empieza con http significa que lo quiero mostrar porque viene la url completa
    /**Si no viene significa que la tengo local, y si no es nada de eso voy a mostrar el placeholder que significa 
     * que no tengo NINGUNA IMAGEN
     * Con esto logramos que nunca nos de error en caso de que el admin se olvide de cargarle la imagen al producto
     */

    const customSrc = ( src ) ? src.startsWith('http') ? src : `/products/${ src }` : '/imgs/placeholder.jpg'
  return (
    <Image
    className={ className }
    src={ customSrc } 
    width={ width } 
    height={ height } 
    alt={ alt } 
    style={ style }
    />
  )
}
