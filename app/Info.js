import { useNavigation } from "@react-navigation/native";
import React, {useState} from "react";
import { SafeAreaView, Text, Image, ScrollView, Pressable, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";

export default function Info({route}) {
    const item = route.params.item;

    const [favorite, setFavorite] = useState(false);

    function handleFavorite() {
        if(favorite){
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        else{
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        setFavorite(!favorite);
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginLeft: 15, marginRight: 15}}>
                <Pressable onPress={() => handleFavorite()}>
                    <Image source={
                        favorite ? require('../assets/heart-icon-filled.png') : require('../assets/heart-icon.png')} 
                        style={{resizeMode: 'contain', height: 40, width: 40,  tintColor: '#86DEB7'}}/>
                </Pressable>
            </View>
            <Image
                source={{ uri: "https:" + item.organization.logo }}
                style={{ width: 256, height: 200, resizeMode: "contain",alignSelf: 'center' }}
            />
            <Text style={{marginLeft: 15, fontSize: 25, fontWeight: '700'}}>{item.title}</Text>
            <Text style={{marginTop: 8, marginLeft: 16, fontSize: 15, fontWeight: '400'}}>{item.organization.name}</Text>
            <ScrollView style={{marginLeft: 15, marginRight: 15, marginTop: 15}}>
                <Text>{item.description}</Text>
            </ScrollView>
            <Pressable style={styles.applyButton} onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                WebBrowser.openBrowserAsync(item.url + "/apply");
            }}>
                <Text style={{textAlign: "center", fontSize: 20, fontWeight: '600'}}>Apply</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    applyButton: {
        alignSelf: 'center',
        backgroundColor: '#ADEEE3',
        justifyContent: 'center',
        marginTop: 10, 
        marginBottom: 25, 
        height: 40,
        width: '50%',
        borderRadius: 10,
    }
})