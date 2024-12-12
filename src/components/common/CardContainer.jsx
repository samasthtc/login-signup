import PropTypes from "prop-types";
export default function CardContainer({ type = "", position = "", children }) {
  const classes =
    type === "add"
      ? position + " col-12 col-lg-6 rounded-4 px-4 mx-auto w-100"
      : position === "right"
      ? " bg-2 col-12 rounded-4 px-4 mx-auto "
      : " bg-2 col-sm-12 col-11 col-md-8 col-lg-6 col-xl-4 border border-2 border-accent-shadow rounded-5 p-4";

  return <div className={classes}>{children}</div>;
}

CardContainer.propTypes = {
  children: PropTypes.any.isRequired,
  position: PropTypes.string,
  type: PropTypes.string,
};
