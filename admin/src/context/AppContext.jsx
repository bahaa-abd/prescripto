import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { translate } from "../i18n/index";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Language state (en/ar) with persistence
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "ar"
  );

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", language);
    document.title = language === "ar" ? "لوحة بريسكريبتو" : "Prescripto Panel";
  }, [language]);

  const t = (key, ns) => translate(language, key, ns);

  // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  // Function to calculate the age eg. ( 20_01_2000 => 24 )
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const value = {
    backendUrl,
    currency,
    slotDateFormat,
    calculateAge,
    language,
    setLanguage,
    t,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  children: PropTypes.node,
};

export default AppContextProvider;
