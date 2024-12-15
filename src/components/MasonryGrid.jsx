import PropTypes from "prop-types";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function MasonryGrid({ children }) {
  return (
    <div>
      <ResponsiveMasonry
      columnsCountBreakPoints={ {350: 1, 767: 2, 1230: 3} }
      >
        <Masonry gutter="2rem" sequential={true}>
          {children}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}

MasonryGrid.propTypes = {
  children: PropTypes.any,
};
