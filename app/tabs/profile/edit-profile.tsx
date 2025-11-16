import { DropdownSelect } from '@/components/DropdownSelect';
import { InputContainer } from '@/components/InputContainer';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextInputField } from '@/components/TextInputField';
import { ViewContainer } from '@/components/ViewContainer';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfile } from '@/services/authService';
import { formatDate } from '@/utils/formatDate';
import { formatCNPJ } from '@/utils/formatCNPJ';
import { editProfile } from '@/services/userService';
import { validateBirthDate } from '@/utils/validateBirthDate';
import { validatePassword } from '@/utils/validatePassword';
import { validateEmail } from '@/utils/validateEmail';
import { validateCNPJ } from '@/utils/validateCNPJ';

interface UserData {
  id?: number;
  email: string;
  user_type?: "researcher" | "collaborator" | "company" ;
  password?: string,
  profile: {
    firstName?: string;
    surname?: string;
    campus?: string;
    category?: string;
    fantasyName?: string;
    size?: string;
    cnpj?:string;
    birthDate?:string;
  };
}

export default function EditProfile() {
    const router = useRouter();
    const [userData, setUserData] = useState<UserData | null>(null);  
    const [form, setForm] = useState<UserData | any >({
                                                        email: "",
                                                        user_type: "researcher",
                                                        password: "",
                                                        profile: {
                                                          firstName: "",
                                                          surname: "",
                                                          campus: "",
                                                          category: "",
                                                          fantasyName: "",
                                                          size: "",
                                                          cnpj: "",
                                                          birthDate: ""
                                                        }
                                                      });
    const [loading, setLoading] = useState(false);

    const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        const data = await getProfile();
        setUserData(data);
        setForm(data)
      } 
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setLoading(false); 
      }
    };

    useEffect(() => {
      fetchUserData();
    }, []);
  
  
    const campusOptions = [
      { label: "UNB DARCY RIBEIRO", value: "UNB DARCY RIBEIRO" },
      { label: "UNB GAMA: FCTE", value: "UNB GAMA: FCTE"},
      { label: "UNB PLANALTINA: FUP", value: "UNB PLANALTINA: FUP" },
      { label: "UNB CEILÂNDIA: FCE", value: "UNB CEILÂNDIA: FCE" },  
    ];
    const categoriaOptions = [
      { label: "DISCENTE", value: "DISCENTE" },
      { label: "SERVIDOR", value: "SERVIDOR" },
      { label: "EXTERNO", value: "EXTERNO" },
    ];
    const porteOptions = [

        { label: "MICROEMPRESA (ME)", value: "MICROEMPRESA (ME)"},
        { label: "MICROEMPREENDEDOR INDIVIDUAL", value: "MICROEMPREENDEDOR INDIVIDUAL"},
        { label: "EMPRESA DE PEQUENO PORTE (EPP)", value: "EMPRESA DE PEQUENO PORTE (EPP)"},
        { label: "EMPRESA DE MÉDIO PORTE", value: "EMPRESA DE MÉDIO PORTE"},
        { label: "EMPRESA DE GRANDE PORTE", value: "EMPRESA DE GRANDE PORTE"},

    ]

    function cleanObject(obj: any): any {
          if (Array.isArray(obj)) {
            return obj.map(cleanObject).filter(v => v !== undefined);
          }

          if (obj !== null && typeof obj === "object") {
            const cleaned: any = {};

            Object.entries(obj).forEach(([key, value]) => {
              const cleanedValue = cleanObject(value);

              if (
                cleanedValue !== "" &&
                cleanedValue !== null &&
                cleanedValue !== undefined &&
                !(typeof cleanedValue === "object" && Object.keys(cleanedValue).length === 0)
              ) {
                cleaned[key] = cleanedValue;
              }
            });

            return cleaned;
          }

          return obj;
        }

    function checkUserType(form: UserData) {
          const { profile, ...rest } = form;
          if(profile.birthDate){
            profile.birthDate =  profile.birthDate.split("/").reverse().join("-")
          }

          const profileKey =
            form.user_type === "researcher"
              ? "researcher_profile"
              : form.user_type === "collaborator"
              ? "collaborator_profile"
              : "company_profile";

          return {
            ...rest,
            [profileKey]: profile
          };
    }

  
    async function handleSubmit() {
        if (form.email && !validateEmail(form.email)) {
            return
        }
        if (form.password && !validatePassword(form.password) ) { 
          return;
        }

        if (form.user_type === "researcher" && !form.email.endsWith("@unb.br")) {
          Alert.alert("Use um e-mail institucional @unb.br.");
          return;
        }

        if (form.profile.birthDate && !validateBirthDate(form.profile.birthDate)) {
          return;
        }
        if (form.profile.cnpj && !validateCNPJ(form.profile.cnpj)) {
            return
        }

      setLoading(true);
      const newForm = checkUserType(form)
      const cleanedForm = cleanObject(newForm);

      try { 
          await editProfile(cleanedForm)  
          Alert.alert("Sucesso!", "Novos dados salvos com sucesso.")
          router.push("/tabs/profile")
      } catch (error: any) {
          console.error(error)
          console.log('Erro detalhado:', JSON.stringify(error, null, 2));

          const errorMsg = "Não foi possível editar o perfil. Tente novamente mais tarde."
          Alert.alert("Erro ao salvar dados", errorMsg)
          router.push("/tabs/profile")
      } finally {
          setLoading(false);
      }
  
    }


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={1}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ViewContainer>
          { userData?.user_type !== "company" &&
            <InputContainer label="Nome:">
                <TextInputField
                  placeholder="Primeiro nome"
                  value={form.profile.firstName}
                  onChangeText={(text) => setForm({
                            ...form,
                            profile: { 
                              ...form.profile,
                              firstName: text
                            }
                          })}
                />
            </InputContainer>
          }

          { userData?.user_type !== "company" &&
            <InputContainer label="Sobrenome:">
                <TextInputField
                  placeholder="Sobrenome"
                  value={form.profile.surname}
                  onChangeText={(text) => setForm({
                            ...form,
                            profile: { 
                              ...form.profile,
                              surname: text
                            }
                          })}
                />
            </InputContainer>
          }


              { userData?.user_type === "company" &&
                <InputContainer label="Nome Fantasia:">
                    <TextInputField
                        placeholder="Nome da Empresa"
                        value={form.profile.fantasyName}
                        onChangeText={(text) =>
                          setForm({
                            ...form,
                            profile: { 
                              ...form.profile,
                              fantasyName: text
                            }
                          })
                        }
                    />
                </InputContainer>
              }

                
              { userData?.user_type === "company" &&

                <InputContainer label="CNPJ:">
                    <TextInputField
                        placeholder="00.000.000/0000-00"
                        keyboardType="numeric"
                        value={form.profile.cnpj}
                        onChangeText={(text) => {
                            const formatted = formatCNPJ(text);
                            setForm({
                            ...form,
                            profile: { 
                              ...form.profile,
                              cnpj: formatted
                            }
                          });
                        }}
                    />
                </InputContainer>

              }
        
                <InputContainer label="Email:">
                    <TextInputField
                        placeholder="exemplo@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={form.email}
                        onChangeText={(text) => setForm({ ...form, email: text })}
                    />
                </InputContainer>
        
                <InputContainer label="Senha:">
                    <TextInputField
                    placeholder="Mínimo 8 caracteres"
                    secureTextEntry
                    value={form.password}
                    onChangeText={(text) => setForm({ ...form, password: text })}
                    />
                </InputContainer>
        
                {
                  userData?.user_type === "company" &&
                  <InputContainer label="Porte:">
                      <DropdownSelect
                          options={porteOptions}
                          placeholder="Selecione o porte"
                          value={form.profile.size}
                          onSelect={(text) => setForm({
                            ...form,
                            profile: { 
                              ...form.profile,
                              size: text
                            }
                          })}
                      />
                  </InputContainer>
                }

        
            {
              userData?.user_type === "researcher" &&
              <InputContainer label="Data de nascimento:">
                  <TextInputField
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                    value={formatDate(form.profile.birthDate)}
                    onChangeText={(text) => {
                      const formatted = formatDate(text);
                      setForm({
                            ...form,
                            profile: { 
                              ...form.profile,
                              birthDate: formatted
                            }
                          });
                    }}
                  />
              </InputContainer>
              }
              { userData?.user_type === "researcher" &&
                <InputContainer label="Câmpus:">
                    <DropdownSelect
                      options={campusOptions}
                      placeholder="Selecione seu câmpus"
                      value={form.profile.campus}
                      onSelect={(text) => setForm({
                            ...form,
                            profile: { 
                              ...form.profile,
                              campus: text
                            }
                          })}
                    />
                </InputContainer>
              }

              { userData?.user_type === "collaborator" &&
                  <InputContainer label="Categoria">
                      <DropdownSelect
                        options={categoriaOptions}
                        placeholder="Selecione sua categoria"
                        value={form.profile.category}
                        onSelect={(text) => setForm({
                            ...form,
                            profile: { 
                              ...form.profile,
                              category: text
                            }
                          })}
                      />
                  </InputContainer>
                  }


              <PrimaryButton
                  title={loading ? "Salvando..." : "Salvar"}
                  onPress={handleSubmit}
                  disabled={loading}
              />
                
          </ViewContainer>

      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
