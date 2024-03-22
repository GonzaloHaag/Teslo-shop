/**Pagina para /admin/product/productSlug */

import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";


interface Props {
    params:{
        productslug:string; //se debe llamar igual que la carpeta entre []
    }
}
export default async function ProductPage({ params } : Props) {

    const slugProduct = params.productslug;

    //Llamar a mi server action para solicitar las categorias a mi base de datos

    const categories = await getCategories(); //Ya me trae el array de categorias


    const product = await getProductBySlug( slugProduct ); //Para obtener el producto (mi server action se encarga de la solicitud a la base de datos )

    if( !product && slugProduct!=='new' ) {
      //Si no quiere crear un producto
      redirect('/admin/products')
    }

    const title = ( slugProduct === 'new' ) ? 'Nuevo producto' : 'Editar producto'
  return (
    <>
    <Title title={ title } className="px-5 sm:px-0" />
    <ProductForm product={ product ?? {} } categories = { categories } />
    </>
  );
}