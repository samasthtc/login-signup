import PropTypes from "prop-types";
export default function CardContainer({ type = "", position = "", children }) {
  const classes =
    type === "add"
      ? position +
        " col-12 col-md-4 rounded-4 p-4  mx-auto d-flex align-items-center"
      : position +
        (position === "right"
          ? " col-12 col-md-6 col-lg-5 rounded-4 p-4  mx-auto" //border-2 border border-secondary
          : " col-md-5 col-12 border border-3 border-secondary rounded-5 p-4");

  return <div className={classes}>{children}</div>;
}

CardContainer.propTypes = {
  children: PropTypes.any.isRequired,
  position: PropTypes.string,
  type: PropTypes.string,
};
