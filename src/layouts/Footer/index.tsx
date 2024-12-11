import classNames from "classnames";
import  websiteApprove from "@/config/websiteApprove.ts";

const Footer: React.FC = () => {
  return (
    <div
      style={{ textAlign: "center" }}
    >
      © 2015 - {new Date().getFullYear()}
      <span style={{ padding: "0 5px" }}>
        {websiteApprove?.companyMain} 版权所有
      </span>
      <span style={{ padding: "0 5px" }}>|</span> ICP证:
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noreferrer"
      >
        {websiteApprove?.number}
      </a>
    </div>
  );
};
export default Footer;
