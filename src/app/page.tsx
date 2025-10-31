
import HeroSection from '@/components/hero-section';
import ProductSections from "@/components/product-sections";
import { getCellphonesCached, getAccessoriesCached } from "@/lib/data";

export default async function Home() {
  const [phones, accessories] = await Promise.all([
    getCellphonesCached(),
    getAccessoriesCached(),
  ]);

  const allFetchedProducts = [...phones, ...accessories];
  const brands = [...new Set(allFetchedProducts.map((p) => p.brand))];
  const capacities = [...new Set(phones.map((p) => p.capacity))].sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return (
    <>
      <HeroSection />
      <div id="product-catalog" className="container mx-auto px-4 py-12">
        <ProductSections
          allProducts={phones}
          featuredProducts={phones.filter((p) => p.discount > 0)}
          discountedProducts={phones.filter((p) => p.discount > 0)}
          accessories={accessories}
          brands={brands}
          capacityOptions={capacities}
        />
      </div>
    </>
  );
}
