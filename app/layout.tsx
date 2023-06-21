import { Nunito } from 'next/font/google'

import './globals.css'

import Navbar from './components/navbar/Navbar'
import ClientOnly from './components/ClientOnly';
import RegisterModal from './components/modal/RegisterModal';
import LoginModal from './components/modal/LoginModal';
import RentModal from './components/modal/RentModal';

import getCurrentUser from './actions/getCurrentUser';
import ToasterProvider from './providers/ToasterProvider';

const font = Nunito({ subsets: ['latin'] })

export const metadata = {
  title: 'airbnb',
  description: 'Air btb clone',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();
  
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly> 
          <ToasterProvider />
          <RegisterModal />
          <LoginModal />
          <RentModal />
          <Navbar currentUser={currentUser} />
        </ClientOnly>
        <div className='pb-20 pt-28'>
          {children}
        </div> 
        </body>
    </html>
  )
}
