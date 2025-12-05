import { DemandData } from '@/app/tabs/home';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from "./apiClient";

export const getDemands = async () => {
    const response = await apiClient.get("/demand/all/", {
        headers: {}
    })
    return response.data
}

export const getMyDemands = async () => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    const response = await apiClient.get("/demand/")
    return response.data
}

export const createDemand = async (form: DemandData) => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    const response = await apiClient.post("/demand/", form)
    return response.data
}

export const deleteDemand = async (id: number) => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    const response = await apiClient.delete(`/demand/${id}/`)
    return response.data
}

export const updateDemand = async (id: number, form: DemandData) => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    const response = await apiClient.put(`/demand/${id}/`, form)
    return response.data
}

export const getDemandById = async (id: number) => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    const response = await apiClient.get(`/demand/${id}/`)
    return response.data
}

export const getPublicDemandById = async (id: number) => {
    const response = await apiClient.get(`/demand/all/${id}`,  {
        headers: {}
    })
    return response.data
}

export async function searchDemands({
  title,
  knowledgeArea,
  companyName,
}: {
  title?: string;
  knowledgeArea?: string;
  companyName?: string;
}) {
  const params = new URLSearchParams();

  if (title) params.append("title", title);
  if (knowledgeArea) params.append("knowledge_area", knowledgeArea);
  if (companyName) params.append("company", companyName);

  const response = await apiClient.get(`/demand/search/?${params.toString()}`,{
        headers: {}
    });

  return response.data;
}