import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SettingsCard = ({
  rightIcon,
  leftIcon,
  title,
  subtitle,
  smallText,
  smallTextIcon,
  smallTextIconColor,
  link,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 h-60 hover:bg-green-400 hover:cursor-pointer rounded-lg shadow-lg group"
      onClick={handleClick}
    >
      <div className="flex flex-col items-start mt-10 px-10 gap-4">
        {rightIcon && (
          <div className="text-2xl text-green-500 group-hover:text-white">
            {rightIcon}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold group-hover:text-white capitalize">{title}</h2>
          <p className="mt-2 text-md font-bold text-slate-800 group-hover:text-white">
            {subtitle}
          </p>
          {smallText && (
            <div className="mt-1 text-xs flex gap-2 items-center">
              <span
                className={`text-xs ${smallTextIconColor ?? "text-green-500"
                  } bg-green-100 h-5 w-5 rounded-full flex items-center justify-center group-hover:text-white`}
              >
                {smallTextIcon}
              </span>
              <span className="text-gray-400 group-hover:text-white">{smallText}</span>
            </div>
          )}
        </div>
        {leftIcon && (
          <div
            className="text-2xl text-green-500 bg-green-100 h-10 w-10 rounded-full flex items-center justify-center group-hover:text-white"
          >
            {leftIcon}
          </div>
        )}
      </div>
    </div>
  );
};

SettingsCard.propTypes = {
  rightIcon: PropTypes.element,
  leftIcon: PropTypes.element,
  title: PropTypes.any.isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  description: PropTypes.string,
  smallText: PropTypes.string,
  smallTextIcon: PropTypes.element,
  smallTextIconColor: PropTypes.string,
  link: PropTypes.string,
};

export default SettingsCard;