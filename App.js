import React, { useState, useEffect, useRef } from "react";

import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Text,
  View,
  Animated,
} from "react-native";

import ajax from "./src/ajax.js";
import SearchBar from "./src/components/SearchBar";
import DealList from "./src/components/DealList";
import DealDetail from "./src/components/DealDetail";

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [dealsFromSearch, setDealsFromSearch] = useState([]);
  const [currentDealId, setCurrentDealId] = useState(null);

  //const titleXPos = useRef(new Animated.Value(0)).current;
  titleXPos = new Animated.Value(0);

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

  const dealsToDisplay = dealsFromSearch.length > 0 ? dealsFromSearch : deals;

  if (isLoading) {
    // <ActivityIndicator />
    const width = (Dimensions.get("window").width - 150) / 2; //150 is the word size
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleXPos, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(titleXPos, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 }
    ).start();
    return (
      <Animated.View
        style={[
          {
            transform: [
              {
                translateX: titleXPos.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-width, width],
                }),
              },
            ],
          },
          styles.container,
        ]}
      >
        <Text style={styles.header}>Bakesale</Text>
      </Animated.View>
    );
  }

  if (currentDealId) {
    return (
      <View style={styles.main}>
        <DealDetail initialDealData={currentDeal()} onBack={unsetCurrentId} />
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <SearchBar searchDeals={searchDeals} clearSearch={clearSearch} />
      <DealList deals={dealsToDisplay} onItemPress={setCurrentId} />
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

  main: {
    flex: 1,
    //marginTop: 10,
  },

  header: {
    fontSize: 40,
  },
});
