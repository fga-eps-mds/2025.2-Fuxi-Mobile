import { ResearchData } from '@/app/tabs/home';
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

export const createResearch = async (form: ResearchData) => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    const response = await apiClient.post("/research/", form)
    return response.data
}

export const deleteResearch = async (id: number) => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    const response = await apiClient.delete(`/research/${id}/`)
    return response.data
}

export const updateResearch = async (id: number, form: ResearchData) => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    const response = await apiClient.put(`/research/${id}/`, form)
    return response.data
}

export const getResearchById = async (id: number) => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    const response = await apiClient.get(`/research/${id}/`)
    return response.data
}

export const getPublicResearchById = async (id: number) => {
    const response = await apiClient.get(`/research/all/${id}`,  {
        headers: {}
    })
    return response.data
}

export const getFavorites = async () => {
    const response = await apiClient.get("/favorites/")
    return response.data.map((favorite: any)=>{return favorite.research})
}

export const addFavorite = async (id: number) => {
    const response = await apiClient.post("/favorites/add/", {research: id})
    console.log(response.data);
    
    return response.data

}

export const removeFavorite = async (id: number) => {
    const response = await apiClient.delete(`/favorites/remove/${id}`)
    return response.data
}

export const checkFavorite = async (id: number) => {
    const favorites = (await apiClient.get("/favorites/")).data
    if (favorites.some((favorite: any) => favorite.research.id === id)){
        return favorites.filter((favorite: any) => favorite.research.id === id)[0].id
    } else{
        return null
    }
}

export async function searchResearches({
  title,
  knowledgeArea,
  keywords,
  researcherName,
  campus,
  status
}: {
  title?: string;
  knowledgeArea?: string;
  keywords?: string[];
  researcherName?: string;
  campus?: string;
  status?: string;
}) {
  const params = new URLSearchParams();

  if (title) params.append("title", title);
  if (knowledgeArea) params.append("knowledge_area", knowledgeArea);
  if (researcherName) params.append("researcher", researcherName);
  if (campus) params.append("campus", campus);
  if (status) params.append("status", status);

  if (keywords && keywords.length > 0) {
      keywords.forEach(kw => params.append("keyword", kw));
  }

  const response = await apiClient.get(`/research/search/?${params.toString()}`,{
        headers: {}
    });

  return response.data;
}