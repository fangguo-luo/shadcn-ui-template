import { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { getUserToken } from "@/services/app.ts";

interface deviceIdInterface {
  deviceId?: string;
}
export interface validCodeInterface extends deviceIdInterface {
  originalImage?: string;
  slidingImage?: string;
  yheight?: number;
}
interface loginParamsInterface extends deviceIdInterface {
  email: string;
  password: string;
}
interface TokenInterface {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  appToken: string | null;
  appTokenExpireTime: string | null;
}
export interface TokenStateInterface
  extends validCodeInterface,
    TokenInterface {
  resetToken: () => void;
  getAppToken: () => void;
  login: (params: loginParamsInterface) => any;
  logout: () => any;
  getValidCode: () => void;
}
const initToken: TokenInterface = {
  appToken: null,
  appTokenExpireTime: null,
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
};
export const initState: TokenStateInterface = {
  ...initToken,
  deviceId: "",
  resetToken: () => null,
  getAppToken: () => null,
  login: () => null,
  logout: () => null,
  getValidCode: () => null,
};
export const createToken: StateCreator<
  TokenStateInterface,
  [],
  [["zustand/persist", TokenStateInterface]],
  TokenStateInterface
> = persist(
  (set) => ({
    ...initState,
    // 重置token信息
    resetToken: () => {
      set({ ...initToken });
    },
    getAppToken: async () => {
      const res = await AppServe.getAppToken();
      if (res) {
        const { AppToken, ExpireTime } = res;
        const appTokenExpireTime = String(
          new Date().getTime() + ExpireTime * 1000
        );
        localStorage.setItem("appToken", AppToken);
        localStorage.setItem("appTokenExpireTime", appTokenExpireTime);
        set({
          appToken: AppToken,
          appTokenExpireTime,
        });
      }
    },
    login: async (params: loginParamsInterface) => {
      try {
        const res = await getUserToken(params);
        if (res) {
          localStorage.setItem("accessToken", res.access_token);
          localStorage.setItem("refreshToken", res.refresh_token);
          const { access_token, refresh_token, expires_in } = res;
          set({
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
          });
          return { success: true };
        } else {
          return { success: false };
        }
      } catch (e) {
        return e;
      }
    },
    logout: async () => {
      try {
        const res = await AppServe.logout();
        if (res?.resp_code === 0) {
          return res.data;
        }
      } catch (e) {
        return e;
      }
    },
    getValidCode: async () => {
      const res = await AppServe.getValidImg();
      if (res?.resp_code === 0) {
        set({ ...res?.data });
      }
    },
  }),
  { name: "userToken" }
);
