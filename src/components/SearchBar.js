import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";

import debounce from "lodash.debounce";

import ajax from "../ajax";

function SearchBar(props) {
  const [isLoading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  debouncedSearchDeals = debounce(props.searchDeals, 3000);

  // BEGIN: This is a pattern: Run use effect callback function after setState
  useEffect(() => {
    debouncedSearchDeals(searchTerm);
    console.log(searchTerm);
  }, [searchTerm]);

  handleChange = (inputedText) => {
    setSearchTerm(inputedText);
  };
  // END:

  useEffect(() => {
    // This is a pattern to not get the error:
    // "useEffect must not return anything besides a function"
    const loadData = async () => {
      setLoading(true);
      const result = await ajax.fetchDealsSearchResult(searchTerm);
      setDeals(result);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <TextInput
      placeholder="Search All Deals"
      style={styles.input}
      onChangeText={handleChange}
    />
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  input: {
    marginTop: 40,
    marginBottom: 5,
    marginHorizontal: 12,
  },
});
