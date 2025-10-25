import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tr from "./tr.json";
import en from "./en.json";
const resources = { tr: { translation: tr }, en: { translation: en } };
i18n.use(initReactI18next).init({
  resources,
  lng: (navigator.language || "en").slice(0,2),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});
export default i18n;
