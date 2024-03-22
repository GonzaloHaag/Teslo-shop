"use client";

import { createOrUpdateProduct, deleteProductImage } from "@/actions";
import { ProductImage } from "@/components";
import { Category, Product, ProductImage as ProductWithImage } from "@/interfaces";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  product: Partial<Product> & { ProductImage?: ProductWithImage[] }; //Le digo que tambien voy a recibir un ProductImage que sera un arreglo
  //El partial lo que hace es decirle que todas las propiedades del Product pueden ser nulas
  categories: any; //categories:Category[]
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
  //campos del formulario 
  title: string;
  slug: string;
  description: string;
  price: number;
  inStock: number;
  sizes: string[];
  tags: string; //camisa,t-shirt --> se insertan en la base de datos como {}
  gender: 'men' | 'women' | 'kid' | 'unisex';
  categoryId: string;

  //Todo:imagenes

  images?:FileList; //sera una lista de archivos
}
export const ProductForm = ({ product, categories }: Props) => {

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch, //El watch le dira al formulario cuando tiene que volverse a renderizar en caso de que haya un cambio en el mismo
  } = useForm<FormInputs>({
    //El getValues me dice el valor de cada campo de mi formulario, lo necesito para la seleccion de tallas
    /**Con ese getValues hago un getValues('sizes').includes(sizeActual) y con eso se cual es la talla seleccionada
     * El setValue lo utilizamos para establecer un nuevo valor de la talla en este caso
     */
    defaultValues: {
      //valores por defecto para cada campo del formulario
      ...product, //todas las propiedades del product
      tags: product.tags?.join(', '), //para que me lo tome como string
      sizes: product.sizes ?? [],
      images:undefined

    }
  });
  watch('sizes'); //Le digo al formulario que se renderize solo si los sizes cambian --> Clave

  //Funcion para modificar las tallas y poder clickearlas
  const onSizeChange = (size: string) => {

    const sizes = new Set(getValues('sizes')); //el set elimina todo lo que este duplicado
    sizes.has(size) ? sizes.delete(size) : sizes.add(size);

    /**El metodo new Set crea un Set que no acepta duplicados. Si el size que me llega por parametro
     * que es el que se clickeo, ya esta en el array lo elimino, si NO se encuentra en el array, lo agrego
     */

    setValue('sizes', Array.from(sizes)); //Debo convertir el set a array, el Set no es un arreglo --> !OJO!
  }
  const onSubmit = async (data: FormInputs) => {
    //  console.log({data}); aca ya tengo todo lo que se completo en el formulario 
    const formData = new FormData(); //Voy a crear un objeto que es el formulario que yo quiero enviar

    const { images,...productToSave } = data; //desestructuro lo que me viene en la data, saco las imagenes

    if( product.id ) {
      formData.append('id', product.id ?? ''); //El id sera igual al product.id
    }
    //Campos del formulario que quiero enviar
    formData.append('title', productToSave.title);
    formData.append('slug', productToSave.slug);
    formData.append('description', productToSave.description);
    formData.append('price', productToSave.price.toString());
    formData.append('inStock', productToSave.inStock.toString());
    formData.append('sizes', productToSave.sizes.toString());
    formData.append('tags', productToSave.tags);
    formData.append('categoryId', productToSave.categoryId);
    formData.append('gender', productToSave.gender);

    //insertar imagenes 
    if( images ) {
      for( let i = 0; i < images.length; i++ ) {
         formData.append('images',images[i] );
      }
    }
    /**Ahora debo llamar a mi server action para insertar este objeto 
     * en la base de datos
     * El form data se enviara asi :
     * {
[Symbol(state)]: [
  { name: 'id', value: '03de3215-1f8b-4579-b031-bde0501bc95f' },
  { name: 'title', value: 'Kids 3D T Logo Tee' },
  { name: 'slug', value: 'kids_3d_t_logo_tee' },
  {
    name: 'description',
    value: 'Designed for fit, comfort and style, the Tesla T Logo Tee is made from 100% Peruvian cotton and features a silicone-printed T Logo on the left chest.'
  },
  { name: 'price', value: '30' },
  { name: 'inStock', value: '5' },
  { name: 'sizes', value: 'XS,S,M' },
  { name: 'tags', value: 'shirt' },
  {
    name: 'categoryId',
    value: '5ca90b46-e35b-4b90-9cab-c7874862de18'
  },
  { name: 'gender', value: 'kid' }
]
}
     */
    const { ok,product:updatedProduct } = await createOrUpdateProduct(formData);
    //El producto que retorna mi server action lo voy a tratar como updatedProduct, pero es lo mismo

    if( !ok ) {
      alert('Producto no se pudo actualizar');
      return;
    }

    //Si todo sale bien, dirijo a la persona al producto con el slug nuevo creado
    router.replace(`/admin/product/${ updatedProduct?.slug }`);

  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('title', { required: true })} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('slug', { required: true })} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200"
            {...register('description', { required: true })}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200" {...register('price', { required: true, min: 0 })} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('tags', { required: true })} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('gender', { required: true })} >
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('categoryId', { required: true })} >
            <option value="">[Seleccione]</option>
            {
              categories?.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            }
          </select>
        </div>

        <button className="btn-primary w-full">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Inventario</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200" {...register('inStock', { required: true, min: 0 })} />
        </div>
        {/* As checkboxes */}
        <div className="flex flex-col">

          <span>Tallas</span>
          <div className="flex flex-wrap">

            {
              sizes.map(size => (
                // bg-blue-500 text-white <--- si está seleccionado
                <div
                  key={size}
                  onClick={() => onSizeChange(size)}
                  className={`p-2 cursor-pointer border rounded-md mr-2 mb-2 w-14 transition-all text-center ${getValues('sizes').includes(size) && 'bg-blue-500 text-white'}`}>
                  {/*Estoy preguntando si el valor de sizes coincide con la size que estoy recorriendo, si es asi, le pongo esa clase */}
                  <span>{size}</span>
                </div>
              ))
            }

          </div>


          <div className="flex flex-col mb-2">

            <span>Fotos</span>
            <input
            {...register('images') }
              type="file"
              multiple //permitir la carga de varios archivos
              className="p-2 border rounded-md bg-gray-200"
              accept="image/png, image/jpeg, image/avif" //Formatos que aceptare para cargar archivos
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 mx-auto gap-3">
            {
              product.ProductImage?.map((image) => (
                <div key={image.id}>
                  <ProductImage
                    src={ image.url }
                    width={300}
                    height={300}
                    className="rounded-t shadow-md"
                    alt={product.title ?? ''} />

                  <button
                    onClick={() => deleteProductImage(image.id, image.url)} //Llamo a mi server actions
                    type="button"
                    className="btn-danger rounded-b-xl w-[300px] sm:w-full">Eliminar</button>

                </div>
              ))
            }
          </div>

        </div>
      </div>
    </form>
  );
};