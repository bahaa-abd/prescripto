import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData, language, setLanguage } =
    useContext(AppContext);

  const t = (key) => {
    const dict = {
      HOME: { en: "HOME", ar: "الرئيسية" },
      ALL_DOCTORS: { en: "ALL DOCTORS", ar: "جميع الأطباء" },
      ABOUT: { en: "ABOUT", ar: "من نحن" },
      CONTACT: { en: "CONTACT", ar: "اتصل بنا" },
      MY_PROFILE: { en: "My Profile", ar: "ملفي" },
      MY_APPOINTMENTS: { en: "My Appointments", ar: "مواعيدي" },
      MY_PAYMENTS: { en: "My Payments", ar: "مدفوعاتي" },
      LOGOUT: { en: "Logout", ar: "تسجيل الخروج" },
      CREATE_ACCOUNT: { en: "Create account", ar: "إنشاء حساب" },
      LANG: { en: "EN", ar: "AR" },
    };
    return dict[key]?.[language] || key;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="md:flex items-start gap-5 font-medium hidden">
        <NavLink to="/">
          <li className="py-1">{t("HOME")}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">{t("ALL_DOCTORS")}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">{t("ABOUT")}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">{t("CONTACT")}</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4 ">
        <button
          onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
          className="px-3 py-1 border rounded-full text-xs"
        >
          {language === "en" ? "EN" : "AR"}
        </button>
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={userData.image} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  {t("MY_PROFILE")}
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  {t("MY_APPOINTMENTS")}
                </p>
                <p
                  onClick={() => navigate("/my-payments")}
                  className="hover:text-black cursor-pointer"
                >
                  {t("MY_PAYMENTS")}
                </p>
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  {t("LOGOUT")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            {t("CREATE_ACCOUNT")}
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* ---- Mobile Menu ---- */}
        <div
          className={`md:hidden ${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} className="w-36" alt="" />
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              className="w-7"
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded full inline-block">{t("HOME")}</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded full inline-block">
                {t("ALL_DOCTORS")}
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded full inline-block">
                {t("ABOUT")}
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded full inline-block">
                {t("CONTACT")}
              </p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
