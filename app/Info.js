import React, {useEffect, useState} from "react";
import { Alert, SafeAreaView, Text, Image, ScrollView, Pressable, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from "firebase/firestore";
import app from '../firebaseConfig';

export default function Info({ route }) {
    const item = route.params.item;
    const auth = getAuth();
    const db = getFirestore(app);
    const user = auth.currentUser;
    const navigation = useNavigation();

    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            getDoc(userRef).then((docSnap) => {
                if (docSnap.exists() && docSnap.data().savedOpportunities) {
                    const savedOpportunities = docSnap.data().savedOpportunities;
                    setFavorite(savedOpportunities.some(opportunity => opportunity.id === item.id));
                }
            });
        }
    }, [user, item.id]);

    async function handleFavorite() {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                await setDoc(userRef, { savedOpportunities: [] });
            }

            if (favorite) {
                await updateDoc(userRef, {
                    savedOpportunities: arrayRemove({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        organization: item.organization,
                        url: item.url,
                    }),
                });
            } else {
                await updateDoc(userRef, {
                    savedOpportunities: arrayUnion({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        organization: item.organization,
                        url: item.url,
                    }),
                });
            }

            Haptics.impactAsync(favorite ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
            setFavorite(!favorite);
        }
    useEffect(() => {
        const auth = getAuth();

        // check if already favorited
        const checkFavorite = async () => {
            if(auth.currentUser === null){
                return;
            }

            const documentRef = doc(db, 'users', auth.currentUser.uid)
            const collectionRef = collection(documentRef, 'favorites')
            const q = query(collectionRef, where('id', '==', item.id));
            const querySnapshot = await getDocs(q);
            if(querySnapshot.size > 0){
                setFavorite(true);
            }
        }
        checkFavorite();

    }, []); 

    async function handleFavorite() {
        const auth = getAuth();
        const isSignedIn = auth.currentUser !== null;

        if(!isSignedIn){
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Sign In Required', 'Please sign in to save opportunities.', [
                {text: 'Sign In', onPress: () => navigation.navigate('AuthStack', {
                    screen: 'Login',
                    params: {
                        redirectRoute: 'SearchStack/Info',
                        payload: item
                    }
                })},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
            ]);
            return;
        }

        setFavorite(!favorite);

        if(favorite){
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // remove from favorites
            console.log('unfavoriting');
            const documentRef = doc(db, 'users', auth.currentUser.uid)
            const collectionRef = collection(documentRef, 'favorites')
            try{
                const q = query(collectionRef, where('id', '==', item.id));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    deleteDoc(doc.ref);
                    console.log('deleted doc: ', doc.id);
                }); 
                console.log('unfavorited')
            }
            catch(e){
                console.log(e);
            }
        }
        else{
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            // add to favorites
            const documentRef = doc(db, 'users', auth.currentUser.uid);
            const collectionRef = collection(documentRef, 'favorites');
            console.log('created refs')

            // check if already exists
            const q = query(collectionRef, where('id', '==', item.id));
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot.size); 
            if(querySnapshot.size > 0){
                console.log('already exists');
                return;
            }

            await addDoc(collectionRef, item)
            .then(() => {
                console.log('Document successfully written!');
            })
            .catch((error) => {
                console.error('Error writing document: ', error);
            });
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginLeft: 15, marginRight: 15 }}>
                <Pressable onPress={() => handleFavorite()}>
                    <Image source={
                        favorite ? require('../assets/heart-icon-filled.png') : require('../assets/heart-icon.png')}
                        style={{ resizeMode: 'contain', height: 40, width: 40, tintColor: '#86DEB7' }} />
                </Pressable>
            </View>
            <Image
                source={{ uri: "https:" + item.organization.logo }}
                style={{ width: 256, height: 200, resizeMode: "contain", alignSelf: 'center' }}
            />
            <Text style={{marginLeft: 15, fontSize: 25, fontWeight: '700', marginRight: 15}}>{item.title}</Text>
            <Text style={{marginTop: 8, marginLeft: 16, fontSize: 15, fontWeight: '400'}}>{item.organization.name}</Text>
            {item.isRemote ?
                
                <Text style={styles.remoteTextStyle}>Remote</Text> :
                <Text style={styles.inPersonTextStyle}>In Person</Text>  
            }
            <ScrollView style={{marginLeft: 15, marginRight: 15, marginTop: 15}}>
                <Text>{item.description}</Text>
            </ScrollView>
            <Pressable style={styles.applyButton} onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                WebBrowser.openBrowserAsync(item.url + "/apply");
            }}>
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: '600' }}>Apply</Text>
            </Pressable>
        </SafeAreaView>
    );
}}

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
    },
    inPersonTextStyle: {
        color: '#8ac926',
        fontWeight: 'bold', 
        marginLeft: 18,
        marginTop: 5,
    },
    remoteTextStyle:{
        color: '#1982c4',
        fontWeight: 'bold', 
        marginLeft: 18,
        marginTop: 5,
    }
});
