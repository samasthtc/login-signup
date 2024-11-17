import PropTypes from "prop-types"
import Navbar from "@/components/common/Navbar";

export default function GeneralLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

GeneralLayout.propTypes = {
  children: PropTypes.any
}
