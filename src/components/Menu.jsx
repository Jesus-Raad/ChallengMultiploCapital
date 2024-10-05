import Link from 'next/link'
import React from 'react'

const Menu = () => {
  return (
    <nav>
    <ul className='flex gap-4'>
      <li><Link href="/">Inicio</Link></li>
      <li><Link href="/info">Información</Link></li>
      <li><Link href="/analysis">Análisis</Link></li>
      <li><Link href="/privacy">Privacidad</Link></li>
    </ul>
  </nav>
  )
}

export default Menu