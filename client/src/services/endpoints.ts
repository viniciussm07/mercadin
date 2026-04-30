export const endpoints = {
  auth: {
    signIn: "auth/sign-in",
    signUp: "auth/sign-up",
    signInWithToken: "auth/sign-in-with-token",
    syncSession: "auth/sync-session",
  },
  users: {
    me: "users/me",
  },
  products: {
    search: "products/search",
  },
  shoppingLists: {
    root: "shopping-lists",
    detail: (id: string) => `shopping-lists/${id}`,
    addItemToLists: "shopping-lists/items/bulk",
    updateItemQuantity: (id: string) => `shopping-lists/${id}/items/quantity`,
  },
} as const;
