export interface appObjInterface {
  [propName: string]: (data?: any) => any;
}
export interface configInterface {
  fn: string;
  url: string;
  method: string;
  Authorization?: boolean;
}
