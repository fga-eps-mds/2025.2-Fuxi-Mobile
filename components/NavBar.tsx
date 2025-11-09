import { Feather } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";


export function NavBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [userType, setUserType] = useState<string | null>(null);
  const pathname = usePathname();


  useEffect(() => {
    const fetchUserType = async () => {
      const type = await AsyncStorage.getItem("userType");
      setUserType(type);
    };
    fetchUserType();
  }, []);

  // Ícones padrão (para evitar undefined)
  let icon = {
      home: (props: any) => <Feather name="home" size={26} color="#1D1D1D" {...props} />,
      favorites: (props: any) => <Feather name="star" size={26} color="#1D1D1D" {...props} />,
      "create-research": (props: any) => (
        <Feather
          name="plus"
          size={26}
          style={{
            backgroundColor: "#003366",
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
    if (userType === "researcher") return true;
    if (userType === "company") return route.name !== "create-research";
    if (userType === "collaborator") return route.name !== "create-research";
    if (userType === null) return route.name !== "create-research" && route.name !== "favorites";
  });



  return (
    <View style={styles.container}>
      {
      
      visibleRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        // const label =
        //   options.tabBarLabel !== undefined
        //     ? options.tabBarLabel
        //     : options.title !== undefined
        //       ? options.title
        //       : route.name;

        

        const isFocused = route.name.includes(pathname.split("/")[2]);

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

        const renderIcon =
          icon[route.name as keyof typeof icon] ||
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
            {renderIcon({ color: isFocused ? "#003366" : "#80808080" })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 75,
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
