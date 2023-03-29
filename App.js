import React, { useState, useEffect } from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, Text, View } from "react-native";

import ajax from "./src/ajax.js";
import SearchBar from "./src/components/SearchBar";
import DealList from "./src/components/DealList";
import DealDetail from "./src/components/DealDetail";

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [dealsFromSearch, setDealsFromSearch] = useState([]);
  const [currentDealId, setCurrentDealId] = useState(null);

  setCurrentId = (dealId) => {
    setCurrentDealId(dealId);
  };

  unsetCurrentId = () => {
    setCurrentDealId(null);
  };

  searchDeals = async (searchTerm) => {
    const dealsFromSearch = await ajax.fetchDealsSearchResult(searchTerm);
    setDealsFromSearch(dealsFromSearch);
  };

  clearSearch = () => {
    setDealsFromSearch([]);
  };

  useEffect(() => {
    // This is a pattern to not get the error:
    // "useEffect must not return anything besides a function"
    const loadData = async () => {
      setLoading(true);
      const result = await ajax.fetchInitialDeals();
      setDeals(result);
      setLoading(false);
    };
    loadData();
  }, []);

  currentDeal = () => {
    return deals.find((deal) => deal.key === currentDealId);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (currentDealId) {
    return (
      <View style={styles.container}>
        <DealDetail initialDealData={currentDeal()} onBack={unsetCurrentId} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <SearchBar searchDeals={searchDeals} clearSearch={clearSearch} />
        <DealList deals={deals} onItemPress={setCurrentId} />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  header: {
    fontSize: 40,
  },
});
