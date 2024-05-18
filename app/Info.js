import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TextInput,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { startTransition, useState, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { Image, Icon } from "@rneui/themed";
import MapView from "react-native-maps";

import { doc, updateDoc, getFirestore, arrayUnion, addDoc, getDoc, setDoc } from "firebase/firestore";
import app from "../firebaseConfig";
import { update } from "firebase/database";

export default function Info({ navigation }) {
  const route = useRoute();
  const data = route.params?.data;
  const user = route.params?.user;
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [starred, setStarred] = useState(null);
  const db = getFirestore(app);

  const addReview = () => {
    if (reviewText.trim()) {
      setReviews([
        ...reviews,
        { key: `${reviews.length + 1}`, text: reviewText },
      ]);
      setReviewText("");
    }
  };
  
  async function starOpportunity() {
    // add to user's starred opportunities
    console.log('erm, what the skibidi?')
    // get ref of starred opportunities array, for user collection
    const userRef = doc(db, "users", user);
    console.log(userRef)
    console.log("data" + data);

    try {
      // check if user has a document
      const docSnap = await getDoc(userRef);
      console.log('got docsnap!')
      if(!docSnap.exists()){
        console.log('adding doc')
        console.log(user)
        console.log(userRef)
        await setDoc(userRef, {
          starredOpportunities:{}
        })
      }

      console.log('updating doc')
      console.log(data.title)
      await updateDoc(userRef, {
        starredOpportunities: {
          [data.id]: {
            title: data.title,
            description: data.description,
            organization: data.organization,
          },
        },
      });
    } catch (errors) {
      console.log(errors);
    }
  }

  useEffect(() => {
    
  }, []);

  return (
    <View>
      <ScrollView>
        <View style={{ flexDirection: "row", paddingTop: 30 }}>
          <Text style={styles.title}>{data.title}</Text>
          <TouchableOpacity style={styles.starButton} onPress={starOpportunity}>
            <Icon name="star" color="white" />
          </TouchableOpacity>
        </View>
        <FullWidthImage source={{ uri: "https:" + data.organization.logo }} />
        <Text style={styles.description}>{data.description}</Text>
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewTitle}>User Reviews</Text>
          <FlatList
            data={reviews}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <Text>{item.text}</Text>
              </View>
            )}
          />
          <TextInput
            style={styles.input}
            placeholder="Write your review here"
            value={reviewText}
            onChangeText={setReviewText}
          />
          <Button
            title="Submit Review"
            style={styles.button}
            onPress={addReview}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function FullWidthImage(props) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const onLayout = useCallback(
    (event) => {
      const containerWidth = event.nativeEvent.layout.width;

      if (props.ratio) {
        setWidth(containerWidth);
        setHeight(containerWidth * props.ratio);
      } else if (typeof props.source === "number") {
        const source = resolveAssetSource(props.source);

        setWidth(containerWidth);
        setHeight((containerWidth * source.height) / source.width);
      } else if (typeof props.source === "object") {
        Image.getSize(props.source.uri, (w, h) => {
          setWidth(containerWidth);
          setHeight((containerWidth * h) / w);
        });
      }
    },
    [props.ratio, props.source]
  );

  return (
    <View onLayout={onLayout}>
      <Image source={props.source} style={{ width, height }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CAD2C5",
  },
  title: {
    paddingRight: 17,
    paddingLeft: 3,
    flex: 1,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: undefined,
  },
  description: {
    padding: 15,
    flex: 1,
    fontSize: 20,
    textAlign: "center",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  reviewContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#CAD2C5",
  },
  reviewTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  reviewItem: {
    padding: 10,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: "#52796F",
    color: "#52796F",
    borderRadius: 30,
  },
  starButton: {
    width: 58,
    height: 58,
    borderRadius: 100,
    backgroundColor: "#2F3E46",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    right: 20,
    top: -10,
  },
});
