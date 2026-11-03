'use client'

import { useState } from "react";
import Image from "next/image";

export default function HeaderCacaoExpress () {
    
    return (
      
        <> 
        <header className="absolute top-0 left-0 w-full bg-white shadow-md p-4 flex items-center justify-between">
          <div>
            <Image src="/CE_LOGO1.svg" alt="Cacao Express" width={100} height={200} className= "h-16 w-auto"/>
          </div>
          <div>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="text-gray-700 hover:text-gray-900">Inicio</a></li>
                <li><a href="/" className="text-gray-700 hover:text-gray-900">Municipios</a></li>
                <li><a href="/" className="text-gray-700 hover:text-gray-900">Contacto</a></li>
              </ul>
            </nav>
          </div>
        </header>
        
        </>
    );
}