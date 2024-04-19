// SearchContext.js
import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  return (
    <SearchContext.Provider value={{ searchValue, handleSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
