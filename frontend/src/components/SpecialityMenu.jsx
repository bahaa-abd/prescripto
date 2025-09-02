import { useContext } from "react";
import { getSpecialityData } from "../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const SpecialityMenu = () => {
  const { t, language } = useContext(AppContext);
  const list = getSpecialityData(language);
  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-4 py-16 text-[#262626]"
    >
      <h1 className="text-3xl font-medium">{t("FIND_BY_SPECIALITY")}</h1>
      <p className="sm:w-1/3 text-center text-sm">{t("SPECIALITY_DESC")}</p>
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll ">
        {list.map((item, index) => (
          <Link
            to={`/doctors/${item.speciality}`}
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            <img className="w-16 sm:w-24 mb-2 " src={item.image} alt="" />
            <p>{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
