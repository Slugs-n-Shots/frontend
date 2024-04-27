import React from "react";
import MessageArea from "components/common/MessageArea";
import { Outlet } from "react-router-dom";

const ContentArea = () => {
  return (
    <div id="content-area">
      {/* <div>contentArea</div> */}
      <MessageArea />
      <Outlet />
      {/* <div>/contentArea</div> */}
    </div>
  );
};

export default ContentArea;
