import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from "./apiClient";

//LOGIN
export const loginUser = async (email: string, password: string) => {
    const response = await apiClient.post("/users/login/", { email, password })
    const data = response.data

    // Serve para salvar o token 
    await AsyncStorage.setItem("authToken", data.token)
    return data
}

//LOGOUT
export const logoutUser = async () => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    try {
        await apiClient.post("/users/logout/", {}, {
            headers: { Authorization: `Token ${token}` }
        })
    } catch (error) {
        console.error("Erro ao fazer logout:", error)
        AsyncStorage.removeItem("authToken")
    } finally {
        await AsyncStorage.removeItem("authToken")
    }
}

//PERFIL
export const getProfile = async () => {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    const response = await apiClient.get("/users/profile/", {
            headers: { Authorization: `Token ${token}` }
        })
    return response.data
}

//REGISTRO
export const registerUser = async (form: any, tipo: "researcher" | "collaborator" | "company") => {
    const payload: any = {
        email: form.email,
        user_type: tipo,
        password: form.senha,
        
    }

    if (tipo === "researcher") {
        payload.researcher_profile = {
            firstName: form.nome,
            surname: form.sobrenome,
            birthDate: form.dataNascimento.split("/").reverse().join("-"),
            campus: form.campus,
        }
    }

    if (tipo === "collaborator") {
        payload.collaborator_profile = {
            firstName: form.nome,
            surname: form.sobrenome,
            birthDate: form.dataNascimento.split("/").reverse().join("-"),
            category: form.categoria,
        }
    }

    if (tipo === "company") {
        payload.company_profile = {
            fantasyName: form.nomeFantasia,
            cnpj: form.cnpj,
            size: form.porte,
        }
    }

    const response = await apiClient.post("/users/register/", payload)
    return response.data
}
