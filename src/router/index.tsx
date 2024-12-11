import { BrowserRouter } from "react-router-dom";
import BaseRouter from "./config.tsx";
const Router = () => {
  return (
    <BrowserRouter>
      <BaseRouter />
    </BrowserRouter>
  );
};
export default Router;
