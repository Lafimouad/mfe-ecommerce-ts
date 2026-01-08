# Orders Micro-Frontend

Order history and tracking interface.

## Port
3007

## Features
- Order history with full details
- Order status tracking (pending, processing, shipped, delivered, cancelled)
- Filter by status
- Expandable order details with timeline
- Tracking numbers
- Reorder functionality
- Mock order data

## Events Listened
- `mfe:order:created` - New order from checkout

## Events Emitted
- `mfe:add` - Reorder items to cart

## Development
```bash
npm install
npm start
```

Access at: http://localhost:3007
