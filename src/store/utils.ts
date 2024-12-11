import { menuListInterface } from "./user.ts";
//深度优先遍历菜单,存储每一个菜单路径
export const depthEachWarp = (list: any[]) => {
  const r: any[] = [];
  let nodeList: any[] = [];
  const depthEach = (_list: any[]) => {
    if (_list?.length) {
      _list.forEach((item: any) => {
        nodeList.push(item);
        const children: any[] = item?.children ?? [];
        if (children?.length) {
          depthEach(children);
        } else {
          r.push(nodeList);
          nodeList = [];
        }
      });
    }
    return nodeList;
  };
  depthEach(list);
  return r;
};
export const pathMenuListToObj = (menuList: any[]) => {
  const pathMenuListObj: { [index: string]: any[] } = {};
  let defaultSelectedKeys: any[] = [];
  let defaultOpenKeys: any[] = [];
  let defaultSelectedPath = "";
  menuList.map((item, index) => {
    pathMenuListObj[index?.toString()] = item?.map((_item: any) => {
      if (_item.isDefaultSelected && defaultSelectedKeys?.length === 0) {
        defaultSelectedKeys = [_item?.id];
        defaultSelectedPath = _item.path;
        defaultOpenKeys = item?.map((_i: any) => _i.id);
      }
      return _item.path;
    });
  });
  return {
    pathMenuListObj,
    defaultSelectedKeys,
    defaultOpenKeys,
    defaultSelectedPath,
  };
};
//过滤配置不显示的菜单
export const filterMenu = (menuList: Array<menuListInterface>) => {
  if (!menuList) return [];
  const _menuList = [...menuList];
  return _menuList
    .filter((item) => item?.isDisplayed)
    ?.map((_item) => {
      const $item = { ..._item };
      if ($item.children) {
        $item.children = filterMenu($item.children);
      }
      return $item;
    });
};
