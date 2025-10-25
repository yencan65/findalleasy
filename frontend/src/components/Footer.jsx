import React from "react";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer id="app-footer" className="w-full py-6 text-center text-sm text-gray-300 bg-transparent border-t border-gray-700 mt-12">
      <p>{t("footer1")}</p>
      <p>{t("footer2")}</p>
      <p className="font-semibold text-[#CDAA7D]">{t("footer3")}</p>
    </footer>
  );
};
export default Footer;
