import { FormatTextToUppecase } from "../../../utils/formmaters";

function StatusCard(props) {
  return (
    <div className={`px-2 flex gap-2 font-medium items-center py-1 ${props.color}`}>
      <props.icon size={12} className={props.iconColor} />
      <p className="capitalize">{props?.label || props?.name}</p>
    </div>
  );
}

export default StatusCard;
