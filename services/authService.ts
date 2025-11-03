import apiClient from "./apiClient";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loginUser(email: string, password: string) {

//LOGIN
    const response = await apiClient.post("/users/login/", { email, password })
    const data = response.data

    // Serve para salvar o token 
    await AsyncStorage.setItem("authToken", data.token)
    return data
}

//LOGOUT
export async function logoutUser() {
    const token = await AsyncStorage.getItem("authToken")
    if (!token) return

    try {
        await apiClient.post("/users/logout/", {}, {
            headers: { Authorization: 'Token ${token}' }
        })
    } catch (error) {
        console.error("Erro ao fazer logout:", error)
    } finally {
        await AsyncStorage.removeItem("authToken")
    }
}

//PERFIL
export async function getProfile() {
    const response = await apiClient.get("/users/profile/")
    return response.data
}

//REGISTRO
export async function registerUser(form: any, tipo: "researcher" | "collaborator" | "company") {
    const payload: any = {
        email: form.email,
        user_type: tipo,
        password: form.senha,
        
    }

    if (tipo === "researcher") {
        payload.researcher_profile = {
            firstName: form.nome,
            surname: form.sobrenome,
            birthDate: form.dataNascimento,
            campus: form.campus,
        }
    }

    if (tipo === "collaborator") {
        payload.collaborator_profile = {
            firstName: form.nome,
            surname: form.sobrenome,
            birthDate: form.dataNascimento,
            category: form.categotia,
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