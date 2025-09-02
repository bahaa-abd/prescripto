import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Contact = () => {
  const { t } = useContext(AppContext);
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>
          {t("CONTACT_TITLE").split(" ")[0]}{" "}
          <span className="text-gray-700 font-semibold">
            {t("CONTACT_TITLE").split(" ")[1]}
          </span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className=" font-semibold text-lg text-gray-600">
            {t("OUR_OFFICE")}
          </p>
          <p className=" text-gray-500">
            54709 Willms Station <br /> Suite 350, Washington, USA
          </p>
          <p className=" text-gray-500">
            Tel: (415) 555-0132 <br /> Email: greatstackdev@gmail.com
          </p>
          <p className=" font-semibold text-lg text-gray-600">{t("CAREERS")}</p>
          <p className=" text-gray-500">{t("CAREERS_DESC")}</p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
            {t("EXPLORE_JOBS")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
