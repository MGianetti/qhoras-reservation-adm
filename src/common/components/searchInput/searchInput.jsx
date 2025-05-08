import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { useEffect, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { useDebounce } from "../../utils/useDebounce";

const SearchInput = (props) => {
  const { labelSearch, setSearch } = props;

  const [searchInput, setSearchInput] = useState("");

  const debouncedValue = useDebounce(searchInput, 500);

  useEffect(() => {
    setSearch(debouncedValue);
  }, [debouncedValue, setSearch]);

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="search-input" sx={{ color: "#9C9C9C" }}>
        {labelSearch}
      </InputLabel>
      <OutlinedInput
        id="search-input"
        size="small"
        type={"text"}
        label={labelSearch}
        onChange={(e) => setSearchInput(e.target.value)}
        endAdornment={<BiSearchAlt2 size={26} color="#9C9C9C" />}
      />
    </FormControl>
  );
};

export default SearchInput;
