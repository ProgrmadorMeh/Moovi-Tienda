
// src/lib/filters.ts

interface PredefinedFilters {
  Procesador: string[];
  RAM: string[];
  Almacenamiento: string[];
  'Sistema Operativo': string[];
}

export const predefinedFilters: PredefinedFilters = {
  Procesador: [
    "Apple A15 Bionic",
    "Apple A16 Bionic",
    "Apple A18",
    "Apple A18 Pro",
    "Snapdragon 7s Gen 2",
    "Snapdragon 6 Gen 1",
    "Snapdragon 6 Gen 3",
    "Snapdragon 6s Gen 3",
    "Snapdragon 8 Elite",
    "Exynos 1280",
    "Exynos 1580",
    "Helio G99",
    "Helio G85",
    "Dimensity 7300",
    "Dimensity 7400",
    "Dimensity 8350",
    "Exynos 990",
    "Snapdragon 865",
  ],
  RAM: [
    "4 GB",
    "6 GB",
    "8 GB",
    "12 GB",
    "16 GB",
  ],
  Almacenamiento: [
    "64 GB",
    "128 GB",
    "256 GB",
    "512 GB",
    "1 TB",
  ],
  'Sistema Operativo': [
    "iOS 15",
    "iOS 16",
    "iOS 18",
    "Android 14",
    "Android 15",
    "Android 10",
  ],
};
