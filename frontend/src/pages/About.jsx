import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const About = () => {
  const { t } = useContext(AppContext);
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>
          {t("ABOUT_TITLE").split(" ")[0]}{" "}
          <span className="text-gray-700 font-semibold">
            {t("ABOUT_TITLE").split(" ")[1]}
          </span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>{t("ABOUT_WELCOME_1")}</p>
          <p>{t("ABOUT_WELCOME_2")}</p>
          <b className="text-gray-800">{t("OUR_VISION")}</b>
          <p>{t("ABOUT_VISION")}</p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>{t("WHY_CHOOSE_US")}</p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>{t("EFFICIENCY")}</b>
          <p>{t("EFFICIENCY_DESC")}</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>{t("CONVENIENCE")} </b>
          <p>{t("CONVENIENCE_DESC")}</p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>{t("PERSONALIZATION")}</b>
          <p>{t("PERSONALIZATION_DESC")}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
