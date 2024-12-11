import { Menu } from "antd";
import { Link } from "react-router-dom";
import { userStore } from "@/store/createStore.ts";
import { menuListInterface } from "@/store/user.ts";
import Icon from "./Icon.ts";
const MyMenu = () => {
  const menuList = userStore((state) => state.menuList);
  const selectedKeysStore = userStore((state) => state.selectedKeys);
  const openKeysStore = userStore((state) => state.openKeys);
  const updateSelectedKeys = userStore((state) => state.updateSelectedKeys);
  const updateOpenKeys = userStore((state) => state.updateOpenKeys);
  const items = (list: Array<menuListInterface>): Array<any> => {
    return list.map((item) => {
      const menuItem: any = {
        disabled: item?.disabled ?? false,
        icon: item?.icon ? <Icon icon={item?.icon} /> : null,
        key: item?.id,
        label: item?.children ? (
          item?.label
        ) : (
          <Link to={item?.path}>{item?.label}</Link>
        ),
        title: item?.title,
      };
      if (item.children) {
        menuItem["children"] = items(item?.children);
      }
      return menuItem;
    });
  };
  return (
    <Menu
      onOpenChange={(openKeys) => {
        updateOpenKeys(openKeys);
      }}
      onSelect={({ selectedKeys }) => {
        updateSelectedKeys(selectedKeys);
      }}
      selectedKeys={selectedKeysStore}
      openKeys={openKeysStore}
      theme="dark"
      mode={"inline"}
      items={items(menuList)}
    />
  );
};
export default MyMenu;
