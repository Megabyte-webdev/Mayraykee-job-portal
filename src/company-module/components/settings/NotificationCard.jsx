import { useContext, useEffect, useState } from "react";
import { Switch, Group } from "@mantine/core";
import classes from "../../../css/customToogle.module.css";
import { NotificationContext } from "../../../context/NotificationContext";

function NotificationCard({ title, description, id, details, setDetails, initialValue }) {
  const [state, setState] = useState();

  useEffect(() => {
      setDetails({ ...details, [id]: state });
  }, [state]);

  useEffect(() => {
    setState(initialValue)
  }, [initialValue])



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px] md:gap-[30px] border-b py-2 ">
      <div className="flex flex-col min-w-[25%] gap-[10px]">
        <h3 className="text-gray-700 text-sm font-semibold">{title}</h3>
        <span className="text-little text-gray-400">{description}</span>
      </div>

      <div className="flex gap-[15px] items-center">
        <Group justify="center" p="md">
          <Switch
            onClick={(e) => {
              setState(!state);
              console.log('clicked')
            }}
            label={state ? "Enabled" : "Disabled"}
            checked={state}
            defaultChecked={state}
            classNames={classes}
          />
        </Group>
      </div>
    </div>
  );
}

export default NotificationCard;
