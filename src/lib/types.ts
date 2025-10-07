export type Product = {
  id: string;
  name: string;
  brand: string;
  storage: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  specifications: { [key: string]: string };
  images: {
    id: string;
    url: string;
    alt: string;
    hint: string;
  }[];
};
