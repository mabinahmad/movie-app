import { useState } from "react";

const useToolTip = () => {
  const [tooltipState, setTooltipState] = useState({});

  const showToolTip = (id) => {
    setTooltipState((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  const hideToolTip = (id) => {
    setTooltipState((prev) => ({
      ...prev,
      [id]: false,
    }));
  };



  return {
    isTooltipVisible: (id) => tooltipState[id] || false,
    showToolTip,
    hideToolTip,
  };
};

export default useToolTip;
