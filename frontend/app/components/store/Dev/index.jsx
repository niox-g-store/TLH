import React from 'react';
import './style.css'

const Dev = () => {
    return (
        <div
          style={{
            display: 'flex',
            width: 'fit-content',
            marginTop: '1%'
          }}
        >
        <a
          style={{
            fontSize: '12px',
            marginLeft: '5px',
            textDecoration: 'none',
            color: '#fff',
            display: 'flex'
            }} href="mailto:olalekanisaac75@gmail.com?subject=Make%20me%20a%20website&body=Good%20day,%0D%0A%0D%0AI%20would%20like%20a%20website.">



          <span className="heart"></span>
            <p style={{ margin: '3px 0px 0px 0px', fontSize: '12px' }}>the site? contact</p>
          </a>
        </div>
    )
}

export default Dev;