// src/lib/filters.ts

interface PredefinedFilters {
  RAM: string[];
  Almacenamiento: string[];
}

export const predefinedFilters: PredefinedFilters = {
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
};
