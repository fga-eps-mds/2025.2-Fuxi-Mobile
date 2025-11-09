import { PrimaryButton } from "@/components/PrimaryButton";
import { getProfile, logoutUser } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { UserData } from "./tabs/home";

export default function Index() {
  const router = useRouter()

  const fetchUserData = async () => {

    try {
        let user: UserData | null = null
        const token = await AsyncStorage.getItem("authToken")
        if (token) {
           user = await getProfile() as UserData
           AsyncStorage.setItem("userType", user.user_type)
           if (user) router.push("/tabs/home")
        }else{
          await AsyncStorage.removeItem("userType")
      }
    } catch (e) {
        logoutUser()
        router.push("/")
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  return (
    <View style = {styles.container}>

      <StatusBar/>

      <Image
      source = {require("../assets/images/vitra1-logo.png")}
      style = {styles.logo}
      resizeMode = "contain"
      />

      <Text style = {styles.title}>Bem vindo!</Text>
      <Text style = {styles.subtitle}>Toda grande descoberta começou com uma perguntas simples.</Text>

      <PrimaryButton
        title = "Entrar"
        onPress={() => router.push("/auth/login")}
      />

      <PrimaryButton
        title="Cadastrar"
        color="#0055AA"
        onPress={() => router.push("/auth/register-type")}
      />

      <PrimaryButton
        title="Apenas visualizar"
        color="#007A33"
        onPress={() => router.push("/tabs/home")}
      />
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffff",
    paddingHorizontal:20,
  },

  logo: {
    width: 150,
    height: 150,
    marginBottom: 17,
    resizeMode: "contain",

  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#003366",
    fontFamily: "Roboto",

  },
  
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginVertical: 12,
    fontFamily: "Roboto",
  },

})