import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { resourceUrl } from "../../../services/axios-client";
import { formatDate, FormatPrice } from "../../../utils/formmaters";
import { AuthContext } from "../../../context/AuthContex";
import { FaSpinner } from "react-icons/fa"; // Import Faspinner

function TableRow({ data, isMarket = false, handleAddToCart, handleRemoveCart, cartItems }) {
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // State for loader

  const role = authDetails.user.role === "employer" ? "company" : "applicant";

  const navigateToStaff = () =>
    navigate(`/${role}/${data.staff_category}/${data.domestic_staff_id}`);

  const employmentType =
    !data?.employment_type || data?.employment_type === "-- Select Employment Type --"
      ? "Nothing to display"
      : data?.employment_type;

  const handleCartAction = async () => {
    setLoading(true); // Start loading

    const existingItem = cartItems?.find((current) => data.id === current.domestic_staff_id);

    if (existingItem) {
      await handleRemoveCart({ ...existingItem, domestice_staff_id: existingItem?.domestic_staff_id });
    } else {
      await handleAddToCart(data);
    }

    setLoading(false); // Stop loading
  };

  return (
    <tr className="border-b cursor-pointer hover:bg-gray-50 text-gray-700 text-sm">
      {/* Profile Image and Name */}
      <td className="text-left py-3 px-2 w-1/5">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={
              data.profile_image
                ? `${resourceUrl}/${data.profile_image}`
                : "/placeholder2.png"
            }
            alt="Profile"
          />
          <span className="truncate">{data?.first_name} {data?.surname}</span>
        </div>
      </td>

      {/* Subcategory */}
      <td className="text-left py-3 px-2 w-1/5">
        <span className="truncate">{data?.subcategory}</span>
      </td>

      {/* Email */}
      <td className="text-left py-3 px-2 w-1/5">
        <span className="truncate">{data?.email}</span>
      </td>

      {/* Employment Type */}
      <td className="text-left py-3 px-2 w-1/5">
        <span className="truncate">{employmentType}</span>
      </td>

      {/* Price */}
      <td className="text-left py-3 px-2 w-1/5">
        <span className="truncate">{data?.expected_salary && FormatPrice(parseFloat(data?.expected_salary))}</span>
      </td>

      {/* Start Date (conditionally rendered) */}
      {!isMarket && (
        <td className="text-left py-3 px-2 w-1/5">
          <span className="truncate">{formatDate(data.start_date)}</span>
        </td>
      )}

      {/* Action Buttons */}
      <td className="text-center py-3 px-2 w-1/5">
        {isMarket ? (
          <button
            onClick={handleCartAction}
            className="text-primaryColor hover:underline flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : cartItems?.find((current) => data.id === current.domestic_staff_id)
              ? "Remove from Cart"
              : "Add to Cart"}
          </button>
        ) : (
          <button
            onClick={navigateToStaff}
            className="text-yellow-500 hover:underline"
          >
            View Details
          </button>
        )}
      </td>
    </tr>
  );
}

export default TableRow;
