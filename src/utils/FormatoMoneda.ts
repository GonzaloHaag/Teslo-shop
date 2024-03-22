//la idea es indicar el formato de moneda correto con javascript 
export const FormatoMoneda = ( value:number ) => {
  return new Intl.NumberFormat('en-US',{

    //vamos a suponer que estamos en USA, pero luego ponerlo en argentina
    style:'currency',
    currency:'USD',
    minimumFractionDigits:2,
    maximumSignificantDigits:2,

  }).format(value); //que me formatee el valor que recibo, la idea es usarla donde tenemos que mostrar precios
}