import { DropdownSelect } from "@/components/DropdownSelect";
import { InputContainer } from "@/components/InputContainer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { TextAreaInputField } from "@/components/TextAreaInputField";
import { TextInputField } from "@/components/TextInputField";
import { ViewContainer } from "@/components/ViewContainer";
import { getDemandById, updateDemand } from "@/services/demandService";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator,
} from "react-native";
import colors from "@/theme/colors";

export default function EditDemand() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const demandId = Number(id);

    const [form, setForm] = useState<any>({
        title: "",
        knowledge_area: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        if (!demandId) return;
        const fetchDemand = async () => {
            try {
                const data = await getDemandById(demandId);
                setForm({
                    title: data.title,
                    knowledge_area: data.knowledge_area,
                    description: data.description,
                });
            } catch (error) {
                Alert.alert(
                    "Erro",
                    "Não foi possível carregar os dados do projeto."
                );
                router.back();
            } finally {
                setPageLoading(false);
            }
        };
        fetchDemand();
    }, [demandId]);

    const handleSubmit = async () => {
        if (Object.values(form).some((value) => !value)) {
            Alert.alert("Preencha todos os campos obrigatórios.");
            return;
        }

        setLoading(true);
        try {
            const updatedForm = { ...form };
            await updateDemand(demandId, updatedForm);
            Alert.alert("Sucesso!", "Demanda atualizada com sucesso.");
            router.push("/tabs/profile/company-demands");
        } catch (error: any) {
            const errorMsg =
                error.response?.data?.detail ||
                "Não foi possível atualizar o projeto. Tente novamente mais tarde.";
            Alert.alert("Erro na atualização", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={1}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ViewContainer>
                    <Text style={styles.title}>Editar Demanda:</Text>
                    <InputContainer label="Título:">
                        <TextInputField
                            placeholder="Título"
                            value={form.title}
                            onChangeText={(text) =>
                                setForm({ ...form, title: text })
                            }
                        />
                    </InputContainer>

                    <InputContainer label="Descrição:">
                        <TextAreaInputField
                            placeholder="Descrição"
                            value={form.description}
                            onChangeText={(text) =>
                                setForm({ ...form, description: text })
                            }
                        />
                    </InputContainer>

                    <InputContainer label="Área de conhecimento:">
                        <TextInputField
                            placeholder="Área de conhecimento"
                            value={form.knowledge_area}
                            onChangeText={(text) =>
                                setForm({ ...form, knowledge_area: text })
                            }
                        />
                    </InputContainer>

                    <PrimaryButton
                        title={loading ? "Atualizando..." : "Atualizar"}
                        onPress={handleSubmit}
                        disabled={loading}
                    />
                </ViewContainer>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        fontWeight: "800",
        marginEnd: "auto",
        marginBottom: 15,
        color: colors.primary,
        fontFamily: "Roboto",
    },
    container: {
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 6,
    },
    inputContainer: {
        backgroundColor: "#F5F8FF",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E0E6F0",
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    input: {
        fontSize: 15,
        color: "#007BFF",
        paddingVertical: 8,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },
    tag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F2F5",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 4,
        borderWidth: 1,
        borderColor: "#E2E6EB",
    },
    tagText: {
        marginRight: 6,
        color: "#333",
    },
});
