import apiClient from "./apiClient";

export const getUser = async (id: number) => {
  
  const response = await apiClient.get(`/users/${id}/`, {headers: {}})
    return response.data
}

export const editProfile = async (form: any) => {
  const response = await apiClient.patch(`/users/${form.id}/`, form)
  return response.data
}



