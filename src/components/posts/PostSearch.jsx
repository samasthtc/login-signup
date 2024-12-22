import PropTypes from "prop-types";
export default function PostSearch({ searchTerm, setSearchTerm }) {
  return (
    <div className="input-group fit-content ">
      <input
        className="form-control rounded-pill ps-45 z-1"
        type="search"
        name="search"
        placeholder="Search posts..."
        value={searchTerm}
        autoComplete="off"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <span className="input-group-append">
        <span
          className="btn border-0 bg-transparent rounded-pill
           position-absolute start-0 me-n5 z-3 cursor-normal pe-none"
        >
          <i className="fa fa-search text-primary"></i>
        </span>
      </span>
    </div>
  );
}

PostSearch.propTypes = {
  searchTerm: PropTypes.any,
  setSearchTerm: PropTypes.func,
};
