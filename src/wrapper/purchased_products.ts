import { create } from "zustand";

type PurchasedProductsState = {
  products: PurchasedProduct[] | null;
  set_purchased_products: (response: PurchasedProduct[]) => void;
  highest_product: () => PurchasedProduct | undefined;
};

export const usePurchasedProducts = create<PurchasedProductsState>(
  (set, get) => ({
    products: null,

    set_purchased_products: (response) => {
      set({ products: response });
    },

    highest_product: () => {
      const products = get().products;
      if (products === null) return undefined;

      return products.reduce((prev, current) => {
        if (current === undefined) return prev;
        if (prev === undefined) return current;
        return prev.frontend_priority > current.frontend_priority
          ? prev
          : current;
      }, undefined as PurchasedProduct | undefined);
    },
  })
);
