import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { HomeScreen } from "../screens/HomeScreen";
import { FlightsScreen } from "../screens/FlightsScreen";
import { HotelsScreen } from "../screens/HotelsScreen";
import { PackagesScreen } from "../screens/PackagesScreen";
import { colors } from "../theme/colors";

export type RootTabParamList = {
  Home: undefined;
  Flights: { destinationCode?: string } | undefined;
  Hotels: undefined;
  Packages: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const ICONS: Record<keyof RootTabParamList, string> = {
  Home: "🏠",
  Flights: "✈️",
  Hotels: "🏨",
  Packages: "🧳",
};

const LABELS: Record<keyof RootTabParamList, string> = {
  Home: "בית",
  Flights: "טיסות",
  Hotels: "מלונות",
  Packages: "חבילות",
};

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitle: LABELS[route.name as keyof RootTabParamList],
          headerTitleStyle: { color: colors.brand900 },
          tabBarActiveTintColor: colors.brand500,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>{ICONS[route.name as keyof RootTabParamList]}</Text>,
          tabBarLabel: LABELS[route.name as keyof RootTabParamList],
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Flights" component={FlightsScreen} />
        <Tab.Screen name="Hotels" component={HotelsScreen} />
        <Tab.Screen name="Packages" component={PackagesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
