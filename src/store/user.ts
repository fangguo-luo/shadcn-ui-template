import { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { getUserInfo } from "@/services/user.ts";
import { depthEachWarp, pathMenuListToObj, filterMenu } from "./utils.ts";

export interface menuListInterface {
  id: string;
  parentId: string;
  icon: string;
  disabled?: boolean;
  path: string;
  isDisplayed: boolean;
  label: string;
  title: string;
  isDefaultSelected: boolean; //是否默认选中菜单项
  children?: Array<menuListInterface> | undefined;
}
export interface UserInterface {
  user: any;
  dataPermission: any;
  userOtherInfo: any;
  pathMenuList: any[];
  pathMenuListObj: any;
  isLoggedIn: boolean;
  selectedKeys: Array<string>;
  openKeys: Array<string>;
  defaultSelectedPath: string;
  menuList: Array<menuListInterface>;
  getUserInfo: () => Promise<any>;
  getMenuList: () => Promise<any>;
  updateLoginStatus: (isLoggedIn: boolean) => void;
  updateSelectedKeys: (selectedKeys: Array<string>) => void;
  updateOpenKeys: (openKeys: Array<string>) => void;
}
export const initUser: UserInterface = {
  user: {},
  menuList: [],
  isLoggedIn: false,
  pathMenuList: [],
  pathMenuListObj: {},
  selectedKeys: [],
  openKeys: [],
  defaultSelectedPath: "",
  dataPermission: {},
  userOtherInfo: {},
  getUserInfo: () => new Promise(() => null),
  getMenuList: () => new Promise(() => []),
  updateLoginStatus: () => null,
  updateSelectedKeys: () => null,
  updateOpenKeys: () => null,
};
export const createUser: StateCreator<
  UserInterface,
  [],
  [["zustand/persist", UserInterface]],
  UserInterface
> = persist(
  (set) => ({
    ...initUser,
    getUserInfo: async () => {
      const res = await getUserInfo();
      if (res?.resp_code === "200") {
        const { user, dataPermission, userOtherInfo } = res ?? {};
        set({
          user,
          dataPermission,
          userOtherInfo,
        });
        return { user, dataPermission, userOtherInfo };
      } else {
        return false;
      }
    },
    getMenuList: async () => {
      const res = await UserServe.getMenuList();
      if (res?.resp_code === 0) {
        const filterMenuList = filterMenu(res?.data);
        const pathMenuList = depthEachWarp(filterMenuList);
        const {
          pathMenuListObj,
          defaultSelectedKeys,
          defaultOpenKeys,
          defaultSelectedPath,
        } = pathMenuListToObj(pathMenuList);
        set({
          pathMenuList,
          pathMenuListObj,
          selectedKeys: defaultSelectedKeys,
          openKeys: defaultOpenKeys,
          defaultSelectedPath,
          menuList: filterMenuList,
        });
        return filterMenuList;
      } else {
        return [];
      }
    },
    updateLoginStatus: (isLoggedIn) => {
      set({ isLoggedIn });
    },
    updateSelectedKeys: (selectedKeys: Array<string>) => {
      set({ selectedKeys });
    },
    updateOpenKeys: (openKeys: Array<string>) => {
      set({ openKeys });
    },
  }),
  { name: "userInfo" }
);
