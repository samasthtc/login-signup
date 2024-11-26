import PropTypes from "prop-types";
export default function CardContainer({ type = "", position = "", children }) {
  const classes =
    type === "add"
      ? position +
        " col-12 col-lg-6 rounded-4 px-4 mx-auto w-100"
      : 
        (position === "right"
          ? " col-12 rounded-4 px-4 mx-auto "
          : " col-md-5 col-12 border border-3 border-secondary rounded-5 p-4");

  return <div className={classes}>{children}</div>;
}

CardContainer.propTypes = {
  children: PropTypes.any.isRequired,
  position: PropTypes.string,
  type: PropTypes.string,
};
