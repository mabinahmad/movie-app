import React from "react";
import PropTypes from "prop-types";

// Tooltip component to display a tooltip when isTooltipVisible is true
//----------------------------------------------------------------------
const Tooltip = ({ isTooltipVisible, children }) => {
  // Render the tooltip only if isTooltipVisible is true
  return isTooltipVisible && <div className="tooltip">{children}</div>;
};

// PropTypes for Tooltip component
//----------------------------------------------------------------------
Tooltip.propTypes = {
  // Boolean flag to determine if the tooltip should be visible
  isTooltipVisible: PropTypes.bool.isRequired,
  // Content of the tooltip
  children: PropTypes.node.isRequired,
};

export default Tooltip;
