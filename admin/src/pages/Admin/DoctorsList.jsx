import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors } =
    useContext(AdminContext);
  const { t, language } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const translateSpeciality = (spec) => {
    const map = {
      "General physician": { en: "General physician", ar: "الطب العام" },
      Gynecologist: { en: "Gynecologist", ar: "أمراض النساء" },
      Dermatologist: { en: "Dermatologist", ar: "الأمراض الجلدية" },
      Pediatricians: { en: "Pediatricians", ar: "طب الأطفال" },
      Neurologist: { en: "Neurologist", ar: "أمراض الأعصاب" },
      Gastroenterologist: {
        en: "Gastroenterologist",
        ar: "أمراض الجهاز الهضمي",
      },
    };
    return map[spec]?.[language] || spec;
  };

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">{t("ALL_DOCTORS")}</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((item, index) => (
          <div
            className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            key={index}
          >
            <img
              className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500"
              src={item.image}
              alt=""
            />
            <div className="p-4">
              <p className="text-[#262626] text-lg font-medium">{item.name}</p>
              <p className="text-[#5C5C5C] text-sm">
                {translateSpeciality(item.speciality)}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p>{t("AVAILABLE")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
