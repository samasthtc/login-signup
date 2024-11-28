import PropTypes from "prop-types";

export default function GeneralLayout({ children }) {
  return <>{children}</>;
}

GeneralLayout.propTypes = {
  children: PropTypes.any,
};
