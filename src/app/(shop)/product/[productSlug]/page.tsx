/**  Recordemos que estoy trabaando shop como una carpeta simplemente, no es una ruta,
 * por lo tanto esta pagina corresponde a http://localhost:3000/product/productId
 * Esta pagina es para el detalle del producto
 */
//quiero revalidar la pagina cada 7 dias aprox, porque no cambiara mucho
export const revalidate = 604800; //siempre debe ir en segundos
import { getProductBySlug } from "@/actions";
import { ProductMobileSlideShow, ProductSlideShow } from "@/components";
import { titleFont } from "@/config/fonts";
import { notFound } from "next/navigation";

import { StockLabel } from '@/components';
import { Metadata, ResolvingMetadata } from "next";
import { AddToCart } from "./ui/AddToCart";
interface Props {
  //los parametros por url se reciben asi, accedo con el params.productSlug y desde el ProductoGridItem lo mando a la url
  params : {
    productSlug : string;
  }
}
//Para generar un metadata dinamica, basada en el slug del producto:
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.productSlug
 
  // fetch data
  const product = await getProductBySlug( slug ); //info del producto
 
  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product?.title ?? "Producto no encontrado",
    description:product?.description ?? '',
    openGraph: {
      //el openGraph es lo que se utiliza en redes sociales
      title: product?.title ?? "Producto no encontrado",
      description:product?.description ?? '',
      //aca se busca la url de la imagen en produccion https://misitioweb.com/products/product-1/image.png
      images: [`/products/${ product?.images[1] }`], //me tomo la segunda imagen que es mas chica
    },
  }
}
export default async function ProductPage({ params } : Props) {
  const productSlugUrl = params.productSlug; //aca ya tengo lo que viene en la url
  //ahora voy a buscar en mi array de productos, los que coincidan con ese slug que llega en la url

  //tengo una funcion que es un server actions, que recibe el slug y luego hace la peticion a la base de datos, entonces 
  const productBySlug = await getProductBySlug( productSlugUrl );

  if( !productBySlug ) {
    //si el producto no se encuentra, dirigo al not found que tengo dentro de mi carpeta product
    notFound();
  }
  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      { /*slideShow */}
      <div className ="col-span-1 md:col-span-2">


        {/**Mobile slide show */}
         <ProductMobileSlideShow 
         title={productBySlug.title} 
         images={ productBySlug.images } 
         className="block md:hidden" />
        {/**Desktop slide show */}
        {/* el slide espera que le mande las imagenes del producto y el titulo */}
      <ProductSlideShow 
      className="hidden md:block"
      title={ productBySlug.title }
      images={ productBySlug.images }
      />
      </div>
 
      {/*detalles */}
      <div className="col-span-1 px-5">
        {/*Ahora bien: mi pagina tiene una revalidacion cada 7 dias, pero yo quiero que el stock se revalide cada mucho menos,
        porque puede ir variando constanstemente, para ello necesito hacerme un client component solo para este componente de stock **/}
          <StockLabel slug={ productSlugUrl } />
          <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>{ productBySlug.title }</h1>
          <p className="text-lg mb-5">${ productBySlug.price }</p>
          <AddToCart producto={ productBySlug } />
          {/*description*/}
          <h3 className="font-bold text-sm">Descripción</h3>
          <p className="font-light">{ productBySlug.description }</p>
      </div>
    </div>
  );
}