'use client'; //porque vamos a usar swiper
/**crearemos un slider con swiper.js para la pagina de producto individual */
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './productSlideShow.css'; //css personalizado para mi slider
import { Swiper as SwiperObject } from 'swiper'; //para el tipado de mi useState y que no sea null
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import { ProductImage } from "../product-image/ProductImage";

interface Props {
  //quiero recibir las imagenes del producto
  images:string[];
  title:string;
  className?:string;
}

export const ProductSlideShow = ({ images,title,className } :Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();
  return (
    <div className={ className }>
    <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        } as React.CSSProperties }//para que no de error colocamos ese tipado
        spaceBetween={10}
        navigation={true}
        autoplay = {{
          delay:2500
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        {
          //ahora mapeo mis images que llegan para mostrarlas en el slide 
          images.map((image) => (
            <SwiperSlide key={image}>
             <ProductImage
             width={ 1024 } 
             height={ 800 }
             src={ image } //la estamos sacando localmente
             alt={ title }  //para esto pedimos el titulo del producto desde la pagina
             className="rounded-xl object-cover"
             />
            </SwiperSlide>
          ))
        }
      </Swiper>

      {/*Swiper thumbs, lo que va abajo */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
      {
        //aca volvemos a hacer el map y ya esta relacionado con mi swiper de arriba
        images.map((image) => (
          <SwiperSlide key={image}>
           <ProductImage
           width={ 300 } 
           height={ 300 }
           src={ image } //la estamos sacando localmente
           alt={ title }  //para esto pedimos el titulo del producto desde la pagina
           className="rounded-xl object-fill"
           />
          </SwiperSlide>
        ))
      }
      </Swiper>
  </div>
  )
}
