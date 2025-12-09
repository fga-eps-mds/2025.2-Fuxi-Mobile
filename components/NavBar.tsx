import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../theme/colors";


export function NavBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [userType, setUserType] = useState<string | null>(null);


  useEffect(() => {
    const fetchUserType = async () => {
      const type = await AsyncStorage.getItem("userType");
      setUserType(type);
    };
    fetchUserType();
  }, []);

  let icon = {
      home: (props: any) => <Feather name="home" size={26} color="#1D1D1D" {...props} />,
      favorites: (props: any) => <Feather name="star" size={26} color="#1D1D1D" {...props} />,
      "create-project": (props: any) => (
        <Feather
          name="plus"
          size={26}
          style={{
            backgroundColor: colors.primary,
            color: "white",
            borderRadius: 50,
            padding: 5,
          }}
          {...props}
        />
      ),
      "create-demand": (props: any) => (
        <Feather
          name="plus"
          size={26}
          style={{
            backgroundColor: colors.primary,
            color: "white",
            borderRadius: 50,
            padding: 5,
          }}
          {...props}
        />
      ),
      search: (props: any) => <Feather name="search" size={26} color="#1D1D1D" {...props} />,
      profile: (props: any) => <Feather name="user" size={26} color="#1D1D1D" {...props} />,
    };

    const visibleRoutes = state.routes.filter((route) => {
      const { options } = descriptors[route.key];
      const href = (options as { href?: string | null }).href;

      if (href === null) {
        return false;
      }

      switch (userType) {
        case 'company':
          if (route.name.startsWith('create-project')) {
            return false;
          }
          break;
        case 'researcher':
          if (route.name.startsWith('create-demand')) {
            return false;
          }
          break;
  
        case 'collaborator':
          if (route.name.startsWith('create-project') || route.name.startsWith('create-demand')) {
            return false;
          }
          break;
        
        case null: // Representa um usuário convidado (não logado)
          if (route.name.startsWith('create-project') || route.name.startsWith('create-demand') || route.name.startsWith('favorites')) {
            return false;
          }
          break;
      }

      return true;
    });

    // Força a ordem correta dos ícones, já que o Expo Router está reordenando
    const desiredOrder = ['home', 'favorites','create-project', 'create-demand', 'search', 'profile'];
    visibleRoutes.sort((a, b) => {
      const aName = a.name.split('/')[0];
      const bName = b.name.split('/')[0];
      return desiredOrder.indexOf(aName) - desiredOrder.indexOf(bName);
    });




  return (
    <View style={styles.container}>
      {
      
      visibleRoutes.map((route, index) => {
        const { options } = descriptors[route.key];


        const isFocused = route.key === state.routes[state.index].key;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };


        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const iconName = route.name.split('/')[0];
        const renderIcon =
          icon[iconName as keyof typeof icon] ||
          ((props: any) => (
            <Feather name="alert-circle" size={26} color="red" {...props} />
          ));

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {renderIcon({ color: isFocused ? colors.primary : "#80808080" })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    height: 120, 
    paddingVertical: 10,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "rgba(29, 29, 29, 0.30)",
    borderWidth: 1,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
