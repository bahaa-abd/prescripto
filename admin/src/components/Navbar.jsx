import { useContext } from "react";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const { aToken, setAToken } = useContext(AdminContext);
  const { language, setLanguage } = useContext(AppContext);

  const navigate = useNavigate();

  const t = (key) => {
    const dict = {
      ROLE_ADMIN: { en: "Admin", ar: "مسؤول" },
      ROLE_DOCTOR: { en: "Doctor", ar: "طبيب" },
      LOGOUT: { en: "Logout", ar: "تسجيل الخروج" },
    };
    return dict[key]?.[language] || key;
  };

  const logout = () => {
    navigate("/");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          onClick={() => navigate("/")}
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? t("ROLE_ADMIN") : t("ROLE_DOCTOR")}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          className="px-3 py-1 border rounded-full text-xs"
        >
          {language === "en" ? "EN" : "AR"}
        </button>
        <button
          onClick={() => logout()}
          className="bg-primary text-white text-sm px-10 py-2 rounded-full"
        >
          {t("LOGOUT")}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
