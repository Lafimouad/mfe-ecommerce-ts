
import React from 'react';
export const Button = ({children,...props}:{children:any}) => (
  <button style={{padding:'8px 12px',borderRadius:6}} {...props}>{children}</button>
)
