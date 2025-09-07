import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import DoctorReviews from "../../components/DoctorReviews";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } =
    useContext(DoctorContext);
  const { currency, backendUrl, t } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(t("PLEASE_SELECT_VALID_IMAGE"));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("IMAGE_SIZE_TOO_LARGE"));
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async () => {
    try {
      const formData = new FormData();

      // Add image if selected
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Add other profile data
      formData.append("address", JSON.stringify(profileData.address));
      formData.append("fees", profileData.fees);
      formData.append("about", profileData.about);
      formData.append("available", profileData.available);

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        formData,
        {
          headers: {
            dToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        setSelectedImage(null);
        setImagePreview(null);
        getProfileData();
      } else {
        toast.error(data.message);
      }

      setIsEdit(false);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const cancelEdit = () => {
    setIsEdit(false);
    setSelectedImage(null);
    setImagePreview(null);
    // Reset profile data to original state
    getProfileData();
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div className="relative">
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={imagePreview || profileData.image}
              alt="Doctor Profile"
            />

            {isEdit && (
              <div className="mt-3">
                <label className="flex items-center gap-2 cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    {selectedImage ? t("CHANGE_PHOTO") : t("UPDATE_PHOTO")}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {selectedImage && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t("NEW_PHOTO_SELECTED")}: {selectedImage.name}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/* ----- Doc Info : name, degree, experience ----- */}

            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {profileData.experience}
              </button>
            </div>

            {/* ----- Doc About ----- */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
                {t("ABOUT")} :
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {isEdit ? (
                  <textarea
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        about: e.target.value,
                      }))
                    }
                    type="text"
                    className="w-full outline-primary p-2 border border-gray-300 rounded"
                    rows={8}
                    value={profileData.about}
                  />
                ) : (
                  profileData.about
                )}
              </p>
            </div>

            <p className="text-gray-600 font-medium mt-4">
              {t("APPOINTMENT_FEE")}:{" "}
              <span className="text-gray-800">
                {currency}{" "}
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                    className="border border-gray-300 rounded px-2 py-1 w-20"
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>

            <div className="flex gap-2 py-2">
              <p>{t("ADDRESS")}:</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                    className="border border-gray-300 rounded px-2 py-1 mb-2 w-full"
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>

            <div className="flex gap-1 pt-2">
              <input
                type="checkbox"
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profileData.available}
                disabled={!isEdit}
              />
              <label htmlFor="">{t("AVAILABLE")}</label>
            </div>

            {isEdit ? (
              <div className="flex gap-2 mt-5">
                <button
                  onClick={updateProfile}
                  className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                >
                  {t("SAVE")}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-1 border border-gray-400 text-sm rounded-full hover:bg-gray-400 hover:text-white transition-all"
                >
                  {t("CANCEL")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEdit((prev) => !prev)}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                {t("EDIT")}
              </button>
            )}
          </div>
        </div>

        {/* Doctor Reviews Section */}
        {profileData && <DoctorReviews doctorId={profileData._id} />}
      </div>
    )
  );
};

export default DoctorProfile;
