
export type Product = {
  id: string;
  name: string;
  brand: string;
  model: string;
  storage: string;
  color: string;
  price: number;
  stock: number;
  description?: string;
  images: { url: string; alt: string; hint: string }[];
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
};
