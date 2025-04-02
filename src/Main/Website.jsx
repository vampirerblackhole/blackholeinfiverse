import React from 'react'
// import StarsCanvas from '../../main/StarBackground'
import BHI from '../component/BHI/BH'
import Main from '../component/Robotics/Main'
import Main2 from '../component/Gaming/Main2'
import Navbar from '../Navbar/Navbar'
import Main3 from '../component/Ai/Main3'
// import Exp from '../component/shaders/Exp'

function Website() {
  return (
    <>
      <div>
        {/* <Exp/>
         */}
      {/* <BHI/> */}
      <Main/> {/* Main will render the robot */}
      <Main2/> {/* Main2 will not render the robot */}
      </div>
    </>
  )
}

export default Website
