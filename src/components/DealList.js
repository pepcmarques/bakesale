import React from "react";
import { View, FlatList, StyleSheet } from "react-native";

import DealItem from "./DealItem";

function DealList(props) {
  return (
    <View style={styles.list}>
      <FlatList
        data={props.deals}
        keyExtractor={({ key }) => key}
        renderItem={({ item }) => <DealItem deal={item} onPress={props.onItemPress} />}
      />
    </View>
  );
}

export default DealList;

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%",
    paddingTop: 5,
    backgroundColor: "#eee",
  },
});
