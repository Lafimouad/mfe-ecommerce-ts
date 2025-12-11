
import React, {useState} from 'react';
export const CheckoutApp = () => {
    const [done,setDone]=useState(false);
    return (
      <div style={{padding:20}}>
        <h2>Checkout</h2>
        {done? "Paid!" : (
          <button onClick={()=>setDone(true)}>Pay now</button>
        )}
      </div>
    )
}
