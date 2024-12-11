import {useEffect} from "react";
import { useLocation, useRoutes, useNavigate } from "react-router-dom";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import ContextDemo from "@/pages/demo/context";
import UseMemoDemo from "@/pages/demo/useMemo";
import UseCallbackDemo from "@/pages/demo/useCallback"
import MyContext from "@/pages/demo/context/myContext";
import Test from "@/pages/demo/test";
import AutomaticBatching from "@/pages/demo/react18/AutomaticBatching"
import StartTransition from "@/pages/demo/react18/StartTransition";
import UseDeferredValue from "@/pages/demo/react18/UseDeferredValue";
import { userStore } from "@/store/createStore.ts";
import MyLayout from "@/layouts";
const NoMatch = () => <div style={{ color: "#000" }}>No Match</div>;
interface routerItemInterface {
  path: string;
  element: React.ReactNode | null;
  children?: Array<routerItemInterface>;
}
const routers: Array<routerItemInterface> = [{
  path: "/",
  element: <MyLayout />,
  children:[
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path:"demo/context",
      element:<ContextDemo/>
    },
    {
      path:'context/myContext',
      element:<MyContext/>
    },
    {
      path:"useMemoDemo",
      element:<UseMemoDemo/>
    },
    {
      path:"useCallbackDemo",
      element:<UseCallbackDemo/>
    },
    {
      path:"react18/automaticBatching",
      element:<AutomaticBatching/>
    },
    {
      path:"react18/startTransition",
      element:<StartTransition/>
    },
    {
      path:"react18/useDeferredValue",
      element:<UseDeferredValue/>
    },
    {
      path:"test",
      element:<Test/>
    }
  ]
}

];
const BaseRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = userStore((state) => state.isLoggedIn);
  const updateSelectedKeys = userStore((state) => state.updateSelectedKeys);
  const updateOpenKeys = userStore((state) => state.updateOpenKeys);
  const pathMenuList = userStore((state) => state.pathMenuList);
  const pathMenuListObj = userStore((state) => state.pathMenuListObj);
  useEffect(() => {
    //判断登录状态，未登录状态则跳转登录页面
    // if (location.pathname !== "/login" && !isLoggedIn) {
    //   navigate("/login");
    // }
    /*let menuIndex = "";
    //todo 判断是否有菜单权限，没有则显示404页面或者显示没有页面访问权限？
    Object.keys(pathMenuListObj).some((key: string) => {
      if (pathMenuListObj[key].includes(location.pathname)) {
        menuIndex = key;
        return true;
      }
    });
    if (isLoggedIn) {
      if (menuIndex) {
        let selectedKeys: any[] = [];
        const openKeys = pathMenuList[Number(menuIndex)].map((item: any) => {
          if (item.path === location.pathname) {
            selectedKeys = [item?.id];
          }
          return item.id;
        });
        updateSelectedKeys(selectedKeys);
        updateOpenKeys(openKeys);
      } else if (location.pathname !== "/login") {
        navigate("/404");
      }
    }*/
  }, [location.pathname]);
  return useRoutes(routers);
};
export default BaseRouter;
