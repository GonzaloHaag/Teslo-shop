'use client'; //porque vamos a usar swiper
/**crearemos un slider con swiper.js para la pagina de producto individual */
import { Swiper, SwiperSlide } from "swiper/react"
import Image from "next/image";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

import './productSlideShow.css'; //css personalizado para mi slider
import { Autoplay, FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";


interface Props {
  //quiero recibir las imagenes del producto
  images:string[];
  title:string;
  className?:string;
}

export const ProductMobileSlideShow = ({ images,title,className } :Props) => {
  return (
    <div className={ className }>
    <Swiper
        style={{
          width:'100vw',
          height:'500px',

        }}
        pagination
        autoplay = {{
          delay:2500
        }}
        modules={[FreeMode, Thumbs, Autoplay,Pagination]}
        className="mySwiper2"
      >
        {
          //ahora mapeo mis images que llegan para mostrarlas en el slide 
          images.map((image) => (
            <SwiperSlide key={image}>
             <Image 
             width={ 600 } 
             height={ 500 }
             src={`/products/${ image }`} //la estamos sacando localmente
             alt={ title }  //para esto pedimos el titulo del producto desde la pagina
             className="object-cover"
             />
            </SwiperSlide>
          ))
        }
      </Swiper>
  </div>
  )
}
