import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Oculus from './Experience3';
import StadiumExperience from './StadiumExperience';

function Main2() {
  // Fade out effect for the '.Game' container after animation finishes
 

  return (
    <div className="container">
      <div className="Game" style={{ position: 'relative', zIndex: 48,
            height: '500vh'

      }}>
     
        <div
          className="model-container"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 48, // Keep the 3D model on top but ensure sections aren't hidden behind it
          }}
        >
          <Oculus />
        </div>

       
      
      </div>
      

      <div
        className="stadium-container"
        style={{ position: 'relative', zIndex: 48 ,
            height: '600vh'}}
      >
      <div
          className="stadium"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            width: '100vw',
            zIndex: 10, // Keep the 3D model on top but ensure sections aren't hidden behind it
          }}
        >
          {/* <NameCanva /> */}
          <StadiumExperience />
        </div>

       
      </div>
    </div>
  );
}

export default Main2;
