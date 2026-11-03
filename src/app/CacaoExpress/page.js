'use client'

import Image from "next/image";
import HeaderCacaoExpress from "../headerCacaoExpress";

export default function CacaoExpress () {
    

    return (
        <>
            <HeaderCacaoExpress />
            <section className="mt-20 p-6 bg-white shadow-md ">
          <div>
            <h2>Bienvenido a CacaoExpress</h2>
            <object data="/MapaTabasco.xml" type="image/svg+xml" width={600} height={400} className="w-max h-max"
            />
          </div>
        </section>
        </>
    )
}