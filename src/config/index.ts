interface envHostInterfaces {
    [propName: string]: string;
}
/**
 * 接口地址
 * @description env 可为主要环境或自定义地址
 */
const apiAddress: envHostInterfaces = {
    dev: "http://192.168.10.21:31000",
    qa: "http://192.168.10.61:31000",
    pre: "http://192.168.10.201:31000",
    prod: "https://msapi.ailecheng.com",
};
export {apiAddress};