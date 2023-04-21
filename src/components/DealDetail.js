import React, { useRef, useState, useEffect } from "react";

import {
  ActivityIndicator,
  Animated,
  Button,
  View,
  Text,
  Image,
  Linking,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { priceDisplay } from "../util";

import ajax from "../ajax";

function DealDetail(props) {
  const [isLoading, setLoading] = useState(true);
  const [deal, setDeal] = useState(props.initialDealData);

  const scrollX = new Animated.Value(0);

  const { width: windowWidth } = useWindowDimensions();

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

  const openDealURL = () => {
    Linking.openURL(deal.url);
  };

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
      <View style={styles.scrollContainer}>
        {/* useNativeDriver: true REQUIRES Animated.ScrollView */}
        <Animated.ScrollView
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={1}
        >
          {deal.media.map((image, imageIndex) => {
            return (
              <View
                style={{ width: windowWidth, height: 250 }}
                key={imageIndex}
              >
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            );
          })}
        </Animated.ScrollView>
      </View>
      <View>
        <Text style={styles.title}>{deal.title}</Text>
      </View>
      <ScrollView style={styles.detail}>
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
        <View style={styles.buydeal}>
          <Button title="Buy this deal" onPress={openDealURL} />
        </View>
      </ScrollView>
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

  detail: {},

  scrollContainer: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },

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

  buydeal: {
    marginBottom: 30,
  },
});
