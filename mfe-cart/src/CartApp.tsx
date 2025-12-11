
import React, {useState,useEffect} from 'react';
export const CartApp = () => {
    const [items,setItems] = useState<any[]>([]);
    useEffect(()=>{
        const h=(e:any)=>setItems(prev=>[...prev,e.detail]);
        window.addEventListener('mfe:add',h);
        return ()=>window.removeEventListener('mfe:add',h);
    },[]);
    const total = items.reduce((s,i)=>s+i.price,0);
    return (
        <div style={{padding:20}}>
          <h2>Cart</h2>
          {items.length? items.map((i,idx)=>(
            <div key={idx}>{i.title} — ${i.price}</div>
          )): "Empty cart"}
          <div>Total: ${total}</div>
        </div>
    )
}
