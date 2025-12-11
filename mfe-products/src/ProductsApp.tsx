
import React from 'react';
const products = [
    {id:1,title:'Scooter',price:299},
    {id:2,title:'Headphones',price:199}
];
export const ProductsApp = () => (
    <div style={{padding:20}}>
        <h2>Products</h2>
        {products.map(p=>(
            <div key={p.id} style={{margin:8,padding:12,border:'1px solid #ddd'}}>
              <h3>{p.title}</h3>
              <p>${p.price}</p>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('mfe:add',{detail:p}))}>
                Add to cart
              </button>
            </div>
        ))}
    </div>
)
