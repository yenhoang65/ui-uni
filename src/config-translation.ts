import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "../src/locales/en/translation.json";
import translationVI from "../src/locales/vi/translation.json";

const resources = {
    en: { translation: translationEN },
    vi: { translation: translationVI },
};

i18next.use(initReactI18next).init({
    lng: "vi",
    debug: true,
    resources,
});
