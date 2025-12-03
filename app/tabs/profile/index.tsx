import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { AppText } from "@/components/AppText";
import { PrimaryButton } from "@/components/PrimaryButton";
import colors from "@/theme/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getProfile, logoutUser } from "@/services/authService";
import { useRouter } from "expo-router";
import { ViewContainer } from "@/components/ViewContainer";
import { ProfileActionCard } from "@/components/ProfileActionCard"; 

interface UserData {
  id: number;
  email: string;
  user_type: "researcher" | "collaborator" | "company";
  profile: {
    firstName?: string;
    surname?: string;
    campus?: string;
    category?: string;
    fantasyName?: string;
    size?: string;
  };
}

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const data = await getProfile();
        setUserData(data);
      } else {
        setIsGuest(true);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      setIsGuest(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const getName = () => {
    if (isGuest) return "Convidado";

    switch (userData?.user_type) {
      case "company":
        return userData.profile.fantasyName;
      case "collaborator":
      case "researcher":
        return userData.profile.firstName;
      default:
        return "Convidado";
    }
  };

  const getSubtitle = () => {
    switch (userData?.user_type) {
      case "researcher":
        return userData.profile.campus;
      case "company":
        return userData.profile.size;
      case "collaborator":
        return userData.profile.category;
      default:
        return "";
    }
  };

  const getEmail = () => {
    if (!userData) return "";
    return userData.email;
  };

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ViewContainer style={{justifyContent: "flex-start"}}>
        {loading ? (
          <View style={[styles.box, { justifyContent: "center" }]}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <>
            {isGuest ? (
              <View style={styles.box}>
                <AppText style={styles.name}>Convidado</AppText>

                <PrimaryButton
                  title="Entrar"
                  onPress={() => router.push("/auth/login")}
                />

                <PrimaryButton
                  title="Cadastrar"
                  color="#0055AA"
                  onPress={() => router.push("/auth/register-type")}
                />
              </View>
            ) : (
              <View style={styles.box}>
                <AppText style={styles.name}>{getName()}</AppText>
                <AppText style={styles.email}>{getEmail()}</AppText>
                <AppText style={styles.subtitle}>{getSubtitle()}</AppText>
              </View>
            )}


            {!isGuest && (
              <>
                {userData?.user_type === "researcher" && (
                  <ProfileActionCard
                    title="Meus Projetos"
                    description="Gerencie seus projetos existentes"
                    onPress={() => router.push("/tabs/profile/researcher-projects")}
                  />
                )}
              
              {/* alteração aqui */}
              {userData?.user_type === "company" && (
                <ProfileActionCard
                  title="Minhas Demandas"
                  description="Veja e gerencie as demandas da sua empresa"
                  onPress={() => router.push("/tabs/profile/company-demands")}
                />
              )}
              {/* alteração aqui */}
              
                <ProfileActionCard
                  title="Meu Perfil"
                  description="Atualize seus dados pessoais"
                  onPress={() => router.push("/tabs/profile/edit-profile")}
                />
              </>
            )}

            {/* Botão de logout no final */}
            {!isGuest && (
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Sair da minha conta</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ViewContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 187,
    padding: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
    alignSelf: "stretch",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(152, 152, 152, 0.10)",
    backgroundColor: "#F5F8FF",
    marginTop: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003A7A",
    paddingTop: 10,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#003A7A",
  },

  logoutButton: {
    marginTop: 25,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 45,
    backgroundColor: "#FF0000",
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});
