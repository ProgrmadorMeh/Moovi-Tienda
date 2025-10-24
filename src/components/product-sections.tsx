"use client";

import { useState } from "react";
import { Smartphone, Star, Tag, Watch } from "lucide-react";
import type { Product } from "@/lib/types";
import ProductCatalog from "./product-catalog";

interface ProductSectionsProps {
  allProducts: Product[];
  featuredProducts: Product[];
  discountedProducts: Product[];
  accessories: Product[];
  brands: string[];
  capacityOptions: string[];
}

// Define las pestañas del menú
const TABS = [
  {
    id: "celulares",
    label: "Celulares",
    icon: <Smartphone size={20} />,
  },
  {
    id: "destacados",
    label: "Destacados",
    icon: <Star size={20} />,
  },
  {
    id: "ofertas",
    label: "Ofertas",
    icon: <Tag size={20} />,
  },
  {
    id: "accesorios",
    label: "Accesorios",
    icon: <Watch size={20} />,
  },
];

export default function ProductSections({
  allProducts,
  featuredProducts,
  discountedProducts,
  accessories,
  brands,
  capacityOptions,
}: ProductSectionsProps) {
  const [activeTab, setActiveTab] = useState("celulares");

  // Determina qué productos mostrar según la pestaña activa
  const getActiveProducts = () => {
    switch (activeTab) {
      case "destacados":
        return featuredProducts;
      case "ofertas":
        return discountedProducts;
      case "accesorios":
        return accessories;
      default:
        return allProducts;
    }
  };

  const activeProducts = getActiveProducts();

  return (
    <div className="w-full">
      {/* --- Menú de Navegación --- */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors duration-200 ease-in-out ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* --- Catálogo de Productos --- */}
      <ProductCatalog
        products={activeProducts}
        brands={brands}
        capacityOptions={capacityOptions}
        // Oculta los filtros si la pestaña no es "Celulares"
        showFilters={activeTab === "celulares"}
      />
    </div>
  );
}
