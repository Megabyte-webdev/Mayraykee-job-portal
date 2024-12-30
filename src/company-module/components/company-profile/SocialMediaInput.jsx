import { useEffect } from "react";

function SocialMediaInput({ data, socials, setSocials }) {
  const updateCurrentVal = (e) => {
    const socialsUpdate = Array.isArray(socials) ? [...socials] : ["", "", "", ""];
    const val = e.target.value;

    switch (data?.id) {
      case 1:
        socialsUpdate[0] = val;
        break;
      case 2:
        socialsUpdate[1] = val;
        break;
      case 3:
        socialsUpdate[2] = val;
        break;
      case 4:
        socialsUpdate[3] = val;
        break;
      default:
        break;
    }

    setSocials((prev) => ({
      ...prev,
      social_media: socialsUpdate,
    }));
  };

  const defaultCurrentVal = () => {
    if (!Array.isArray(socials)) return "";
    switch (data?.id) {
      case 1:
        return socials[0] || "";
      case 2:
        return socials[1] || "";
      case 3:
        return socials[2] || "";
      case 4:
        return socials[3] || "";
      default:
        return "";
    }
  };

  return (
    <div className="h-fit p-1 flex items-center justify-center gap-[5px] border">
      {data.icon}
      <input
        value={defaultCurrentVal()}
        placeholder={data.placeholder}
        onChange={updateCurrentVal}
        className="w-[95%] focus:outline-none"
      />
    </div>
  );
}

export default SocialMediaInput;
