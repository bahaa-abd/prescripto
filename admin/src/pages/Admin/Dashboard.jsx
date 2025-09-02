import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { aToken, getDashData, dashData } = useContext(AdminContext);
  const { t } = useContext(AppContext);
  // const { slotDateFormat } = useContext(AppContext);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    userId: "",
    amount: "",
    type: "deposit",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/admin/all-users",
        { headers: { aToken } }
      );
      if (data.success) setUsers(data.users);
    } catch (err) {
      /* ignore */
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Frontend validation
    if (!paymentForm.userId) {
      setError(t("SELECT_USER"));
      setLoading(false);
      return;
    }
    if (
      !paymentForm.amount ||
      isNaN(paymentForm.amount) ||
      Number(paymentForm.amount) <= 0
    ) {
      setError(t("AMOUNT"));
      setLoading(false);
      return;
    }
    if (typeof paymentForm.description !== "string") {
      setError(t("DESCRIPTION"));
      setLoading(false);
      return;
    }
    // Optionally, check if userId is a string (already enforced by select)
    // Debug: log paymentForm
    console.log("Submitting payment:", paymentForm);
    try {
      console.log(paymentForm);
      const { data } = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/admin/create",
        { ...paymentForm, userId: String(paymentForm.userId) },
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        setShowPaymentForm(false);
        setPaymentForm({
          userId: "",
          amount: "",
          type: "deposit",
          description: "",
        });
        toast.success(data.message);
        getDashData();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const openPaymentForm = () => {
    fetchUsers();
    setShowPaymentForm(true);
  };

  return (
    dashData && (
      <div className="m-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className="text-gray-400">{t("DOCTORS")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">{t("APPOINTMENTS")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">{t("PATIENTS")}</p>
            </div>
          </div>
        </div>

        {/* Payments Section */}
        <div className="bg-white mt-10 p-6 rounded border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src={assets.list_icon} alt="" />
              <p className="font-semibold">{t("ALL_PAYMENTS")}</p>
            </div>
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
              onClick={openPaymentForm}
            >
              {t("MAKE_PAYMENT_FOR_USER")}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">{t("USER")}</th>
                  <th className="py-2 px-4 border">{t("TYPE")}</th>
                  <th className="py-2 px-4 border">{t("AMOUNT")}</th>
                  <th className="py-2 px-4 border">{t("DATE")}</th>
                  <th className="py-2 px-4 border">{t("DESCRIPTION")}</th>
                </tr>
              </thead>
              <tbody>
                {dashData.payments && dashData.payments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-400">
                      {t("NO_PAYMENTS_FOUND")}
                    </td>
                  </tr>
                )}
                {dashData.payments &&
                  dashData.payments.map((item, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="py-2 px-4 border">
                        {item.userId?.name} <br />{" "}
                        <span className="text-xs text-gray-400">
                          {item.userId?.email}
                        </span>
                      </td>
                      <td className="py-2 px-4 border capitalize">
                        {item.type}
                      </td>
                      <td className="py-2 px-4 border">{item.amount}</td>
                      <td className="py-2 px-4 border">
                        {new Date(item.date).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border">
                        {item.description || "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">
                {t("MAKE_PAYMENT_FOR_USER")}
              </h2>
              <form
                onSubmit={handlePaymentSubmit}
                className="flex flex-col gap-3"
              >
                <select
                  value={paymentForm.userId}
                  onChange={(e) =>
                    setPaymentForm((f) => ({ ...f, userId: e.target.value }))
                  }
                  className="border px-3 py-2 rounded"
                  required
                >
                  <option value="">{t("SELECT_USER")}</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder={t("AMOUNT")}
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm((f) => ({ ...f, amount: e.target.value }))
                  }
                  className="border px-3 py-2 rounded"
                  required
                />
                <select
                  value={paymentForm.type}
                  onChange={(e) =>
                    setPaymentForm((f) => ({ ...f, type: e.target.value }))
                  }
                  className="border px-3 py-2 rounded"
                  required
                >
                  <option value="deposit">{t("DEPOSIT")}</option>
                  <option value="withdraw">{t("WITHDRAW")}</option>
                </select>
                <input
                  type="text"
                  placeholder={t("DESCRIPTION_OPTIONAL")}
                  value={paymentForm.description}
                  onChange={(e) =>
                    setPaymentForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  className="border px-3 py-2 rounded"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded"
                    disabled={loading}
                  >
                    {loading ? t("PROCESSING") : t("SUBMIT")}
                  </button>
                  <button
                    type="button"
                    className="border px-4 py-2 rounded"
                    onClick={() => setShowPaymentForm(false)}
                  >
                    {t("CANCEL")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default Dashboard;
