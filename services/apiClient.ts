import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//COLOQUEM O SEU IP LOCAL AQUI QUANDO FOR TESTAR
//Winoows: use "ipconfig" no terminal e procure o seu IPV4
//Mac/Linux: use "ifconfig" no terminal e procure algo como wlan0 e coloque o inet
const IP_LOCAL = ""

const apiClient = axios.create({
    baseURL: IP_LOCAL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Adiocionar o token automaticaente em cada requisicao
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("authToken")
        if (token) {
            config.headers.Authorization = 'Token ${token}'
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default apiClient