import { useContext, useEffect, useState } from "react";
import SubscriptionPlans from "../../pages/SubscriptionPlans";
import useSubscription from "../../hooks/useSubscription";
import { MdClose } from "react-icons/md";
import { SubscriptionContext } from "../../context/SubscriptionContext";

function SubscriptionPackages() {
  // const [isOpen, setIsOpen] = useState(false);
  const subUtils = useContext(SubscriptionContext);


  return (
         <div className="flex flex-col rounded-[10px] bg-white border pb-8">
          <SubscriptionPlans
            packages={subUtils.packages}
            
          />
        </div>
  );
}

export default SubscriptionPackages;
