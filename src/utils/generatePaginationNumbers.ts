//la idea es crearme un arreglo con la cantidad de paginas [1,2,3,4,...,7], suponiendo que el totalPages es 7
/**el currentPage es la pagina actual */

export const generatePaginationNumbers = ( currentPage : number , totalPages:number ) => {
   //si el numero total de paginas ES 7 o menos vamos a mostrar todas las paginas, sin puntos ...
   if( totalPages <=7 ) {
    return Array.from({ length:totalPages },(_i,index) => (
        index + 1 //esto retorna un array [1,2,3,4,5,6,7] de 7 elementos porque indique que el lenght debe ser el total de pages
    ))
   };

   //si la pagina actual esta en entre las primeras 3 paginas, mostrar las primeras 3,..., y las ultimas 2
   if( currentPage <= 3 ) {
    return [1,2,3,'...',totalPages - 1,totalPages] //array de [1,2,3,...,6,7]
   }
   //si la pagina actual esta entre las 3 ultimas paginas, queremos mostrar las primeras 2,...,las ultimas 3 paginas
   if( currentPage >= totalPages - 2 ) {
     return [1,2,'...',totalPages - 2,totalPages - 1,totalPages] //[1,2,...,5,6,7] suponiendo que totalPages = 7
   }

   //Si la pagina actual esta en otro lugar medio, queremos mostrar la primera pagina,..., la pagina actual y vecinos
   return [1,'...',currentPage - 1,currentPage,currentPage + 1,totalPages]; 
   /**Suponiendo que la currentPage(pag actual) es 5 y total pages 7
    * [1,...,4,5,6,7]
    */
}
