import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ControlSidebar from './ControlSidebar'
import Footer from './Footer'

function BackOffice(props) {
  return <>
   <div className='wrapper'>
    <Navbar />
    <Sidebar />

    <div className='content-wrapper'>
        {props.children}
    </div>

    <Footer />
    <ControlSidebar />
   </div>
  
  </>
}

export default BackOffice