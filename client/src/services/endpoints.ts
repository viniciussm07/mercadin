export const endpoints = {
  auth: {
    deleteMe: "auth/me",
    signIn: "auth/sign-in",
    signUp: "auth/sign-up",
    signInWithToken: "auth/sign-in-with-token",
    syncSession: "auth/sync-session",
    updateEmail: "auth/me/email",
    updatePassword: "auth/me/password",
  },
  users: {
    me: "users/me",
  },
  products: {
    search: "products/search",
    searchHistory: "products/search-history",
  },
  priceComparisons: {
    list: (id: string) => `price-comparisons/lists/${id}`,
  },
  shoppingLists: {
    root: "shopping-lists",
    detail: (id: string) => `shopping-lists/${id}`,
    addItemToLists: "shopping-lists/items/bulk",
    updateItemQuantity: (id: string) => `shopping-lists/${id}/items/quantity`,
    removeItem: (id: string, itemId: string) => `shopping-lists/${id}/items/${itemId}`,
  },
} as const;
