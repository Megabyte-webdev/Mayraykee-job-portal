import { useNavigate } from "react-router-dom";
import { resourceUrl } from "../../../services/axios-client";
import { FormatPrice } from "../../../utils/formmaters";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContex";

function TableRow({ data, isMarket = false, handleAddToCart }) {
  const navigate = useNavigate();
  const { authDetails } = useContext(AuthContext);

  const role = authDetails.user.role === "employer" ? "company" : "applicant";

  const navigateToStaff = () =>
    navigate(`/${role}/${data.staff_category}/${data.domestic_staff_id}`);

  const employmentType =
    !data?.employment_type ||
    data?.employment_type === "-- Select Employment Type --"
      ? "Nothing to display"
      : data?.employment_type;

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
        <span className="truncate">{FormatPrice(parseFloat(data?.expected_salary))}</span>
      </td>

      {/* Start Date (conditionally rendered) */}
      {!isMarket && (
        <td className="text-left py-3 px-2 w-1/5">
          <span className="truncate">{data.start_date}</span>
        </td>
      )}

      {/* Action Buttons */}
      <td className="text-left py-3 px-2 w-1/5">
        {isMarket ? (
          <button
            onClick={() => handleAddToCart(data)}
            className="text-primaryColor hover:underline"
          >
            Add to cart
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
