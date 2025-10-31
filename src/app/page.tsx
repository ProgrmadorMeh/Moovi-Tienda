
import HeroSection from '@/components/hero-section';
import ProductSections from "@/components/product-sections";
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data";
import type { Cellphone, Accessory } from "@/lib/types";

export default async function Home() {
  // Fetching data on the server
  const [productsData, accessoriesData] = await Promise.all([
    getCellphonesCached(),
    getAccessoriesCached(),
  ]);

  const allFetchedProducts = [...productsData, ...accessoriesData];
  
  const uniqueBrands = [...new Set(allFetchedProducts.map((p) => p.brand))];
  
  const capacities = [...new Set(productsData.map((p) => p.capacity))].sort(
    (a, b) => parseInt(a) - parseInt(b)
  );
  const uniqueCapacities = capacities;

  return (
    <>
      <HeroSection />
      <div id="product-catalog" className="container mx-auto px-4 py-12">
        <ProductSections
          allProducts={productsData}
          featuredProducts={productsData.filter((p) => p.discount > 0)}
          discountedProducts={productsData.filter((p) => p.discount > 0)}
          accessories={accessoriesData}
          brands={uniqueBrands}
          capacityOptions={uniqueCapacities}
        />
      </div>
    </>
  );
}
