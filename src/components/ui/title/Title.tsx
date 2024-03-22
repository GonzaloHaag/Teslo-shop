/**este title mostrara la categoria en la cual me encuentro, como men, womens o kids */

import { titleFont } from "@/config/fonts";

interface Props {

  title:string;
  subtitle?:string;
  className?:string;
}
export const Title = ({ title, subtitle,className } : Props) => {
  return (
    <div className={`${className}`}>
        <h1 className={`${titleFont.className} antialiased text-4xl font-semibold my-5`}>
          { title }
        </h1>
        {
          subtitle && (
            <h3 className="text-xl mb-5">{ subtitle }</h3>
          )
        }
    </div>
  )
}
