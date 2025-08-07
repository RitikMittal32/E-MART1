import React from "react";
import { useSearch } from "../../context/search";
import axios from "../../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import './SearchInput.css';
import { CiSearch } from "react-icons/ci";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form className="search-input"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="form-control search-side"
          type="search"
          placeholder="Search for products..."
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button className="search-button" type="submit">
          <CiSearch />
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
