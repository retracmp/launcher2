import { create } from "zustand";

type PurchasedProductsState = {
  products: PurchasedProduct[] | null;
  set_purchased_products: (response: PurchasedProduct[]) => void;
  highest_prioirty_product: () => PurchasedProduct | undefined;
};

export const usePurchasedProducts = create<PurchasedProductsState>(
  (set, get) => ({
    products: null,

    set_purchased_products: (response) => {
      set({ products: response });
    },

    highest_prioirty_product: () => {
      return get().products?.reduce((prev, current) => {
        return prev.frontend_priority > current.frontend_priority
          ? prev
          : current;
      });
    },
  })
);
