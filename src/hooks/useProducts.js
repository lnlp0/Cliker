import { useState, useEffect } from 'react';

const generateProducts = () => [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 199.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics',
    description: 'High-quality wireless headphones with noise cancellation',
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 299.99,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics',
    description: 'Advanced smartwatch with health monitoring features',
    rating: 4.3,
    reviews: 89
  },
  {
    id: '3',
    name: 'Coffee Maker',
    price: 79.99,
    image: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Home',
    description: 'Programmable coffee maker with thermal carafe',
    rating: 4.1,
    reviews: 156
  },
  {
    id: '4',
    name: 'Running Shoes',
    price: 129.99,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports',
    description: 'Lightweight running shoes with superior comfort',
    rating: 4.7,
    reviews: 203
  },
  {
    id: '5',
    name: 'Laptop Backpack',
    price: 59.99,
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Accessories',
    description: 'Durable laptop backpack with multiple compartments',
    rating: 4.2,
    reviews: 74
  },
  {
    id: '6',
    name: 'Desk Lamp',
    price: 45.99,
    image: 'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Home',
    description: 'LED desk lamp with adjustable brightness',
    rating: 4.0,
    reviews: 92
  },
  {
    id: '7',
    name: 'Bluetooth Speaker',
    price: 89.99,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Electronics',
    description: 'Portable Bluetooth speaker with rich sound',
    rating: 4.4,
    reviews: 167
  },
  {
    id: '8',
    name: 'Yoga Mat',
    price: 34.99,
    image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Sports',
    description: 'Non-slip yoga mat for all types of exercises',
    rating: 4.6,
    reviews: 145
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(generateProducts());
      setLoading(false);
    }, 1000);
  }, []);

  return { products, loading };
};