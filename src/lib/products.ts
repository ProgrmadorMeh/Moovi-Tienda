import type { Product } from "./types";
import { placeholderImages } from './placeholder-images.json';

const allImages = placeholderImages.map(img => ({
  id: img.id,
  url: img.imageUrl,
  alt: img.description,
  hint: img.imageHint,
}));

export const products: Product[] = [
  {
    id: "pixel-8-pro",
    brand: 'Google',
    model: 'Pixel 8 Pro',
    salePrice: 999,
    capacity: '128GB',
    color: 'Obsidian',
    stock: 50,
    costPrice: 800,
    lastUpdate: '2024-01-01',
    description: 'The Google Pixel 8 Pro is the most advanced Pixel phone yet, with a pro-level camera system, a powerful Google Tensor G3 chip, and a stunning 6.7-inch Super Actua display.',
    images: allImages.filter(img => img.id.startsWith('pixel-8-pro')),
  },
  {
    id: "galaxy-s24-ultra",
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    salePrice: 1299,
    capacity: '256GB',
    color: 'Titanium Gray',
    stock: 30,
    costPrice: 1100,
    lastUpdate: '2024-01-01',
    description: 'Experience the new era of mobile AI with Galaxy S24 Ultra. It comes with a built-in S Pen, a pro-grade camera, and a powerful Snapdragon 8 Gen 3 for Galaxy chip.',
    images: allImages.filter(img => img.id.startsWith('galaxy-s24-ultra')),
  },
  {
    id: "iphone-15-pro",
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    salePrice: 999,
    capacity: '128GB',
    color: 'Natural Titanium',
    stock: 60,
    costPrice: 850,
    lastUpdate: '2024-01-01',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    images: allImages.filter(img => img.id.startsWith('iphone-15-pro')),
  },
  {
    id: "oneplus-12",
    brand: 'OnePlus',
    model: '12',
    salePrice: 799,
    capacity: '256GB',
    color: 'Flowy Emerald',
    stock: 45,
    costPrice: 650,
    lastUpdate: '2024-01-01',
    description: 'The OnePlus 12 is a true flagship, featuring a stunning 2K 120Hz ProXDR display, the latest Snapdragon 8 Gen 3, and 4th Gen Hasselblad Camera for Mobile.',
    images: allImages.filter(img => img.id.startsWith('oneplus-12')),
  },
  {
    id: "xperia-1-v",
    brand: 'Sony',
    model: 'Xperia 1 V',
    salePrice: 1399,
    capacity: '256GB',
    color: 'Khaki Green',
    stock: 20,
    costPrice: 1200,
    lastUpdate: '2024-01-01',
    description: 'Next-gen sensor and computational processing for stunning low-light pictures, plus unique features for creators. Co-developed with the engineers behind the latest Alpha cameras.',
    images: allImages.filter(img => img.id.startsWith('xperia-1-v')),
  },
  {
    id: "pixel-7a",
    brand: 'Google',
    model: 'Pixel 7a',
    salePrice: 499,
    capacity: '128GB',
    color: 'Charcoal',
    stock: 100,
    costPrice: 400,
    lastUpdate: '2024-01-01',
    description: 'The Google Pixel 7a is fast and efficient, with 8 GB of RAM, an amazing camera, and features that are rated highest in security.',
    images: allImages.filter(img => img.id.startsWith('pixel-7a')),
  },
  {
    id: "galaxy-a54",
    brand: 'Samsung',
    model: 'Galaxy A54 5G',
    salePrice: 449,
    capacity: '128GB',
    color: 'Awesome Violet',
    stock: 150,
    costPrice: 350,
    lastUpdate: '2024-01-01',
    description: 'Capture awesome videos with VDIS and a wider OIS angle. The premium glass finish, clean camera layout, and energizing colorways give the Galaxy A54 5G its Awesome identity.',
    images: allImages.filter(img => img.id.startsWith('galaxy-a54')),
  },
  {
    id: "iphone-se",
    brand: 'Apple',
    model: 'iPhone SE (3rd gen)',
    salePrice: 429,
    capacity: '128GB',
    color: 'Midnight',
    stock: 80,
    costPrice: 330,
    lastUpdate: '2024-01-01',
    description: 'Serious power with the A15 Bionic chip and a superstar camera. Plus, the toughest glass in a smartphone and a Home button with secure Touch ID.',
    images: allImages.filter(img => img.id.startsWith('iphone-se')),
  },
];

export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
