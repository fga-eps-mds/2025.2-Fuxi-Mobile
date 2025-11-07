import apiClient from "./apiClient";

export const getUser = async (id: number) => {
  
  const response = await apiClient.get(`/users/${id}/`, {headers: {}})
    return response.data
}



