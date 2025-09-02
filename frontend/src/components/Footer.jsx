import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Footer = () => {
  const { t } = useContext(AppContext);
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm">
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            {t("FOOTER_ABOUT")}
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">{t("COMPANY")}</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>{t("HOME")}</li>
            <li>{t("ABOUT_US")}</li>
            <li>{t("DELIVERY")}</li>
            <li>{t("PRIVACY_POLICY")}</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">{t("GET_IN_TOUCH")}</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-212-456-7890</li>
            <li>greatstackdev@gmail.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">{t("COPYRIGHT_FULL")}</p>
      </div>
    </div>
  );
};

export default Footer;
