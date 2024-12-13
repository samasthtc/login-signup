import PropTypes from "prop-types";
import Input from "./Input";

export default function SearchField({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
}) {
  return (
    <form action="#" className="container-fluid px-0 ms-auto w-100">
      <div className="row g-1 input-group my-3">
        <div className="col-7 col-sm-8 col-md-9 col-lg-10">
          <Input
            type="search"
            name="search"
            autoComplete="off"
            my={0}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="col-5 col-sm-4 col-md-3 col-lg-2">
          <div className="form-floating">
            <select
              className="form-select"
              role="button"
              name="filter"
              id="filter"
              defaultValue={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>
            <label htmlFor="filter" className="form-label">
              By:
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}

SearchField.propTypes = {
  filter: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};
