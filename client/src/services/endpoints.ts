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
  },
} as const;
