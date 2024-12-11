import { createWithEqualityFn } from "zustand/traditional";
import { createUser, UserInterface } from "./user";
import { createToken, TokenStateInterface } from "./token";
export const userStore = createWithEqualityFn<UserInterface>()((...a) => ({
  ...createUser(...a),
}));
export const tokenStore = createWithEqualityFn<TokenStateInterface>()(
  (...a) => ({
    ...createToken(...a),
  })
);
