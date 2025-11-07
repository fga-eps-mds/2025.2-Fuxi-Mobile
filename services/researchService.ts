import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from "./apiClient";

export const getResearches = async () => {
    const response = await apiClient.get("/research/all/", {
  headers: {}
})
    return response.data
}

export const getMyResearches = async () => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    const response = await apiClient.get("/research/")
    return response.data
}

