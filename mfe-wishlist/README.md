# Wishlist Micro-Frontend

Save and manage favorite products.

## Port

3006

## Features

- Save products for later
- Grid card layout
- Move items to cart
- Remove items from wishlist
- Clear all functionality
- Badge counter in main navigation
- LocalStorage persistence with timestamps

## Events Listened

- `mfe:wishlist:add` - Add item to wishlist

## Events Emitted

- `mfe:wishlist:update` - Update wishlist count badge
- `mfe:add` - Move item to cart

## Development

```bash
npm install
npm start
```

Access at: http://localhost:3006
