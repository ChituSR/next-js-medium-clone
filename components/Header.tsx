import React from 'react'
import Link from 'next/link'
function Header() {
  return (
      <header className='flex justify-between p-5 max-w-7xl mx-auto'>
<div className="flex items-center space-x-5">
          <Link href="/">
          <img src="https://miro.medium.com/max/4800/1*jfdwtvU6V6g99q3G7gq7dQ.png" alt="" 
          className='w-44 object-contain cursor-pointer md:inline-flex items-center space-x-5'></img>
          </Link>
      </div><div className="hidden md:inline-flex items-center space-x-5">
        <h3>About</h3>
        <h3>Contact</h3>
        <h3 className='text-white bg-green-600 px-4 py-1 rounded-full'>Follow</h3>
      </div>
      <div className='flex items-center space-x-5 text-green-600'><h3>Sign In</h3>
      <h3 className='border px-4 py-1 rounded-full border-green-600'>Get Started</h3></div>
  
            </header>
  )
}

export default Header 