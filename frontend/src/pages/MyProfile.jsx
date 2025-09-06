import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const { token, backendUrl, userData, setUserData, loadUserProfileData, t } =
    useContext(AppContext);

  function formatDateToYYYYMMDD(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Function to update user profile data using API
  const updateUserProfileData = async () => {
    if (
      !userData.name ||
      !userData.phone ||
      !userData.address?.line1 ||
      !userData.address?.line2 ||
      !userData.gender ||
      !userData.dob
    ) {
      toast.error(t("PLEASE_FILL_ALL"));
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong!");
    }
  };

  if (!userData) return null;

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
      {/* Profile Image */}
      {isEdit ? (
        <label htmlFor="image">
          <div className="inline-block relative cursor-pointer">
            <img
              className="w-36 rounded opacity-75"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt=""
            />
            <img
              className="w-10 absolute bottom-12 right-12"
              src={image ? "" : assets.upload_icon}
              alt=""
            />
          </div>
          <input
            onChange={(e) => setImage(e.target.files?.[0] || false)}
            type="file"
            id="image"
            hidden
          />
        </label>
      ) : (
        <img className="w-36 rounded" src={userData.image} alt="" />
      )}

      {/* Name */}
      {isEdit ? (
        <input
          className="bg-gray-50 text-3xl font-medium max-w-60"
          type="text"
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
          value={userData.name}
        />
      ) : (
        <p className="font-medium text-3xl text-[#262626] mt-4">
          {userData.name}
        </p>
      )}

      {/* User Balance */}
      <div className="text-lg font-semibold text-green-700 mb-2">
        {t("BALANCE")}{" "}
        {userData.balance?.toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
        })}
      </div>

      <hr className="bg-[#ADADAD] h-[1px] border-none" />

      {/* Contact Information */}
      <div>
        <p className="text-gray-600 underline mt-3">
          {t("CONTACT_INFORMATION")}
        </p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
          <p className="font-medium">{t("EMAIL_ID")}</p>
          <p className="text-blue-500">{userData.email}</p>

          <p className="font-medium">{t("PHONE")}</p>
          {isEdit ? (
            <input
              className="bg-gray-50 max-w-52"
              type="text"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
              value={userData.phone}
            />
          ) : (
            <p className="text-blue-500">{userData.phone}</p>
          )}

          <p className="font-medium">{t("ADDRESS")}</p>
          {isEdit ? (
            <p>
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...(prev.address || {}), line1: e.target.value },
                  }))
                }
                value={userData.address?.line1 || ""}
              />
              <br />
              <input
                className="bg-gray-50"
                type="text"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...(prev.address || {}), line2: e.target.value },
                  }))
                }
                value={userData.address?.line2 || ""}
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userData.address?.line1 || ""} <br />{" "}
              {userData.address?.line2 || ""}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <p className="text-[#797979] underline mt-3">
          {t("BASIC_INFORMATION")}
        </p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">{t("GENDER")}</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-50"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender || "Not Selected"}
            >
              <option value="Not Selected">{t("NOT_SELECTED")}</option>
              <option value="Male">{t("MALE")}</option>
              <option value="Female">{t("FEMALE")}</option>
            </select>
          ) : (
            <p className="text-gray-500">
              {t(userData.gender?.toLocaleUpperCase()) || ""}
            </p>
          )}

          <p className="font-medium">{t("BIRTHDAY")}</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-50"
              type="date"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={formatDateToYYYYMMDD(userData.dob) || ""}
            />
          ) : (
            <p className="text-gray-500">
              {formatDateToYYYYMMDD(userData.dob) || ""}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            {t("SAVE_INFORMATION")}
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            {t("EDIT")}
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
