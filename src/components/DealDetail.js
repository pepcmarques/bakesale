import React, { useState, useEffect } from "react";

import {
  ActivityIndicator,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { priceDisplay } from "../util";

import ajax from "../ajax";

function DealDetail(props) {
  const [isLoading, setLoading] = useState(true);
  const [deal, setDeal] = useState(props.initialDealData);

  useEffect(() => {
    // This is a pattern to not get the error:
    // "useEffect must not return anything besides a function"
    const loadData = async () => {
      setLoading(true);
      const result = await ajax.fetchDealDetail(deal.key);
      setDeal(result);
      setLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.deal}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.deal}>
      <TouchableOpacity onPress={props.onBack}>
        <Text style={styles.backLink}>Back</Text>
      </TouchableOpacity>
      <Image style={styles.image} source={{ uri: deal.media[0] }} />
      <View style={styles.detail}>
        <View>
          <Text style={styles.title}>{deal.title}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.info}>
            <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
            <Text style={styles.cause}>{deal.cause.name}</Text>
          </View>
          {deal.user && (
            <View>
              <Image style={styles.avatar} source={{ uri: deal.user.avatar }} />
              <Text>{deal.user.name}</Text>
            </View>
          )}
        </View>
        <View style={styles.description}>
          <Text>{deal.description}</Text>
        </View>
      </View>
    </View>
  );
}

export default DealDetail;

const styles = StyleSheet.create({
  deal: {
    flex: 1,
    width: "100%",
    borderColor: "#bbb",
    marginTop: 35,
    paddingTop: 5,
  },

  backLink: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 12,
    color: "#22f",
  },

  detail: { },

  image: {
    width: "100%",
    height: 150,
    backgroundColor: "#ccc",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  info: {
    padding: 10,
    backgroundColor: "#fff",
  },

  description: {
    padding: 15,
  },

  title: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "rgba(243, 137, 10, 0.4)",
    fontWeight: "bold",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 15,
  },

  cause: {
    flex: 1,
  },

  price: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
});
