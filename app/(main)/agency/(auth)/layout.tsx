import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import React from 'react'

const authLayout = ({children}:{children : React.ReactNode}) => {
  return (
    <ClerkProvider
    appearance={{baseTheme: dark}}
    >
      <div className='h-full flex items-center justify-center'>
      {children}
    </div>
</ClerkProvider>
    
  )
}
 
export default authLayout
