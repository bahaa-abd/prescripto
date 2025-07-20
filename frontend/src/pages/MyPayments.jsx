import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyPayments = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [payments, setPayments] = useState([]);

  const getUserPayments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/payment/get", {
        headers: { token },
      });
      if (data.success) {
        setPayments(data.payments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserPayments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My Payments
      </p>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Description</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No payments found.
                </td>
              </tr>
            )}
            {payments.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="py-2 px-4 border-b">
                  {new Date(item.date).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b capitalize">{item.type}</td>
                <td className="py-2 px-4 border-b">{item.amount}</td>
                <td className="py-2 px-4 border-b">
                  {item.description || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPayments;
