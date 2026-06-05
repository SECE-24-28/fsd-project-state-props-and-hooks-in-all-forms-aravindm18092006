export const DEFAULT_PRODUCTS = [
  // Fruits
  { id: 1,  name: 'Red Apples',              price: 89,  oldPrice: 110, weight: '1 kg',    category: 'fruits',     image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&auto=format&fit=crop' },
  { id: 2,  name: 'Bananas',                 price: 45,  oldPrice: 0,   weight: '1 kg',    category: 'fruits',     image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&auto=format&fit=crop' },
  { id: 3,  name: 'Strawberries',            price: 129, oldPrice: 150, weight: '250g',    category: 'fruits',     image: 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?w=400&auto=format&fit=crop' },
  { id: 4,  name: 'Blueberries',             price: 199, oldPrice: 240, weight: '125g',    category: 'fruits',     image: 'https://images.unsplash.com/photo-1457296898342-cdd24585d095?w=400&auto=format&fit=crop' },
  { id: 5,  name: 'Fresh Oranges',           price: 79,  oldPrice: 0,   weight: '1 kg',    category: 'fruits',     image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&auto=format&fit=crop' },
  { id: 6,  name: 'Seedless Grapes',         price: 149, oldPrice: 180, weight: '500g',    category: 'fruits',     image: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400&auto=format&fit=crop' },

  // Vegetables
  { id: 7,  name: 'Broccoli',                price: 55,  oldPrice: 0,   weight: '500g',    category: 'vegetables', image: 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400&auto=format&fit=crop' },
  { id: 8,  name: 'Carrots',                 price: 35,  oldPrice: 0,   weight: '500g',    category: 'vegetables', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&auto=format&fit=crop' },
  { id: 9,  name: 'Fresh Spinach',           price: 29,  oldPrice: 35,  weight: '250g',    category: 'vegetables', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop' },
  { id: 10, name: 'Roma Tomatoes',           price: 40,  oldPrice: 0,   weight: '1 kg',    category: 'vegetables', image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=400&auto=format&fit=crop' },
  { id: 11, name: 'Russet Potatoes',         price: 30,  oldPrice: 0,   weight: '1 kg',    category: 'vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop' },
  { id: 12, name: 'Sweet Onions',            price: 45,  oldPrice: 0,   weight: '1 kg',    category: 'vegetables', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop' },

  // Dairy
  { id: 13, name: 'Fresh Milk',              price: 49,  oldPrice: 0,   weight: '1L',      category: 'dairy',      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop' },
  { id: 14, name: 'Greek Yogurt',            price: 65,  oldPrice: 0,   weight: '500ml',   category: 'dairy',      image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?w=400&auto=format&fit=crop' },
  { id: 15, name: 'Salted Butter',           price: 55,  oldPrice: 60,  weight: '100g',    category: 'dairy',      image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&auto=format&fit=crop' },
  { id: 16, name: 'Cheddar Cheese',          price: 180, oldPrice: 210, weight: '200g',    category: 'dairy',      image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400&auto=format&fit=crop' },
  { id: 17, name: 'Paneer (Cottage Cheese)', price: 99,  oldPrice: 110, weight: '200g',    category: 'dairy',      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop' },
  { id: 18, name: 'Whipping Cream',          price: 120, oldPrice: 0,   weight: '250ml',   category: 'dairy',      image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&auto=format&fit=crop' },

  // Bakery
  { id: 19, name: 'Whole Wheat Bread',       price: 39,  oldPrice: 0,   weight: '600g',    category: 'bakery',     image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400&auto=format&fit=crop' },
  { id: 20, name: 'Butter Croissant',        price: 29,  oldPrice: 0,   weight: '100g',    category: 'bakery',     image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop' },
  { id: 21, name: 'Chocolate Muffins',       price: 79,  oldPrice: 99,  weight: '2 pcs',   category: 'bakery',     image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop' },
  { id: 22, name: 'Garlic Bread',            price: 59,  oldPrice: 0,   weight: '150g',    category: 'bakery',     image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400&auto=format&fit=crop' },
  { id: 23, name: 'Burger Buns',             price: 35,  oldPrice: 0,   weight: '4 pcs',   category: 'bakery',     image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&auto=format&fit=crop' },
  { id: 24, name: 'Tortilla Wraps',          price: 85,  oldPrice: 100, weight: '6 pcs',   category: 'bakery',     image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&auto=format&fit=crop' },

  // Meat
  { id: 25, name: 'Chicken Breast',          price: 299, oldPrice: 0,   weight: '500g',    category: 'meat',       image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&auto=format&fit=crop' },
  { id: 26, name: 'Mutton Curry Cut',        price: 449, oldPrice: 499, weight: '500g',    category: 'meat',       image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&auto=format&fit=crop' },
  { id: 27, name: 'Smoked Bacon',            price: 349, oldPrice: 399, weight: '250g',    category: 'meat',       image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&auto=format&fit=crop' },
  { id: 28, name: 'Salmon Fillet',           price: 799, oldPrice: 899, weight: '250g',    category: 'meat',       image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop' },
  { id: 29, name: 'Frozen Prawns',           price: 249, oldPrice: 0,   weight: '250g',    category: 'meat',       image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&auto=format&fit=crop' },
  { id: 30, name: 'Chicken Sausage',         price: 179, oldPrice: 199, weight: '300g',    category: 'meat',       image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&auto=format&fit=crop' },

  // Beverages
  { id: 31, name: 'Orange Juice',            price: 79,  oldPrice: 0,   weight: '1L',      category: 'beverages',  image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&auto=format&fit=crop' },
  { id: 32, name: 'Organic Green Tea',       price: 145, oldPrice: 180, weight: '25 bags', category: 'beverages',  image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&auto=format&fit=crop' },
  { id: 33, name: 'Ground Coffee Pack',      price: 280, oldPrice: 0,   weight: '250g',    category: 'beverages',  image: 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&auto=format&fit=crop' },
];
