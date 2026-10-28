export type Category = 'Shirts' | 'Jackets' | 'Polos';
export type Gender = 'Men' | 'Women';

export interface Product {
  id: string;
  name: string;
  category: Category;
  gender: Gender;
  price: number; // Pure numeric INR value
  image: string;
  tags: string[];
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  brand?: string;
  originalPrice?: number;
  discountPercent?: number;
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Atelier Oxford Shirt',
    category: 'Shirts',
    gender: 'Men',
    price: 2499,
    image:
      'https://images.pexels.com/photos/14072176/pexels-photo-14072176.jpeg?auto=compress&cs=tinysrgb&h=900&w=700',
    tags: ['Bestseller', 'Premium Cotton'],
    description:
      'A refined Oxford-weave shirt cut from long-staple Egyptian cotton. Tailored fit with mother-of-pearl buttons and a semi-spread collar.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#f8f8f8' },
      { name: 'Sky', hex: '#a8c8e8' },
      { name: 'Black', hex: '#1a1a1a' },
    ],
  },
  {
    id: 'p2',
    name: 'HKV Vertical Striped Casual Shirt',
    category: 'Shirts',
    gender: 'Men',
    price: 499,
    image: '/products/striped-shirt.jpg',
    tags: ['Trending', 'Vertical Stripes', 'Cotton Blend'],
    description:
      'Contemporary navy & white vertical striped shirt featuring a spread collar, chest pocket, and rolled sleeve tab details for clean casual styling.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Navy & White', hex: '#1b233d' },
      { name: 'Black & White', hex: '#171717' },
      { name: 'Charcoal', hex: '#374151' },
    ],
  },
  {
    id: 'p3',
    name: 'POSHAX Tipped Collar Classic Polo',
    category: 'Polos',
    gender: 'Men',
    price: 449,
    image: '/products/black-polo.png',
    tags: ['Bestseller', 'Athletic Fit', 'Pique Knit'],
    description:
      'Ultra-breathable pique polo shirt in timeless black with white contrast tipping across the ribbed collar and short-sleeve cuffs.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#111111' },
      { name: 'Navy Blue', hex: '#1a237e' },
      { name: 'White', hex: '#f5f5f5' },
    ],
  },
  {
    id: 'p4',
    name: 'Velvet Turtleneck Dress',
    category: 'Shirts',
    gender: 'Women',
    price: 2499,
    image: '/products/p4.png',
    tags: ['Luxury', 'Evening Edit'],
    description:
      'A sleek black knit dress with a refined silhouette and elevated luxury finish designed for evening sophistication.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Black', hex: '#1a1a1a' },
      { name: 'Charcoal', hex: '#2f2f2f' },
      { name: 'Midnight', hex: '#111827' },
    ],
  },
  {
    id: 'p5',
    name: 'Camel Wool Coat',
    category: 'Jackets',
    gender: 'Women',
    price: 1899,
    image: '/products/p5.png',
    tags: ['Luxury', 'Structured'],
    description:
      'A tailored camel wool coat with polished lines and timeless proportions for premium winter layering.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Camel', hex: '#c69c6d' },
      { name: 'Khaki', hex: '#7d6f5d' },
      { name: 'Black', hex: '#161616' },
    ],
  },
  {
    id: 'p6',
    name: 'Olive Utility Shirt Dress',
    category: 'Polos',
    gender: 'Women',
    price: 2199,
    image: '/products/p6.png',
    tags: ['Modern', 'Tailored'],
    description:
      'A luxury olive shirt dress with a feminine waist and flowing silhouette, built for elevated everyday styling.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Olive', hex: '#566349' },
      { name: 'Forest', hex: '#2d3b2c' },
      { name: 'Stone', hex: '#b8b0a1' },
    ],
  },
  {
    id: 'p7',
    name: 'Classic Business Shirt',
    category: 'Shirts',
    gender: 'Men',
    price: 1299,
    image: '/products/p7.png',
    tags: ['Formal', 'Business Essential'],
    description:
      'A tailored business shirt with a clean structure and premium finish crafted for polished office looks.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Sky Blue', hex: '#a9c7e8' },
      { name: 'White', hex: '#f5f5f5' },
      { name: 'Charcoal', hex: '#2a2a2a' },
    ],
  },
  {
    id: 'p8',
    name: 'Tailored Business Jacket',
    category: 'Jackets',
    gender: 'Men',
    price: 2999,
    image:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    tags: ['Layering', 'Corporate'],
    description:
      'Professional layering jacket with crisp structure and understated styling for confident business and evening looks.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Navy', hex: '#162238' },
      { name: 'Charcoal', hex: '#333333' },
      { name: 'Black', hex: '#111111' },
    ],
  },
  {
    id: 'p9',
    name: 'Smart Casual Linen Shirt',
    category: 'Shirts',
    gender: 'Men',
    price: 1599,
    image:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
    tags: ['Professional', 'Soft Tailoring'],
    description:
      'A lightweight linen shirt designed to balance comfort and elegance for business-casual styling and travel-ready wardrobes.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Stone', hex: '#d9d2c5' },
      { name: 'Blue', hex: '#4a6fa5' },
      { name: 'Navy', hex: '#1d3557' },
    ],
  },
  {
    id: 'p10',
    name: 'Green Wool Peacoat',
    category: 'Jackets',
    gender: 'Women',
    price: 2499,
    image: '/products/p10.png',
    tags: ['Essential', 'Luxury Layering'],
    description:
      'An elegant green wool peacoat with a structured silhouette and refined winter appeal for premium everyday dressing.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Forest Green', hex: '#1d3d2e' },
      { name: 'Olive', hex: '#53674f' },
      { name: 'Black', hex: '#111111' },
    ],
  },
];

// Compatibility exports
export const PRODUCTS = products;
export const categories: ('All' | Category)[] = ['All', 'Shirts', 'Jackets', 'Polos'];
export const genders: ('All' | Gender)[] = ['All', 'Men', 'Women'];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'All') return products;
  return products.filter((p) => p.category === category);
}

export function getProductsByGender(gender: 'Men' | 'Women'): Product[] {
  return products.filter((p) => p.gender === gender);
}