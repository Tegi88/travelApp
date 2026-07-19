import { View, Text, Image, Pressable, StyleSheet, ScrollView } from "react-native";
import { DESTINATIONS } from "@travel-app/shared";
import { colors } from "../theme/colors";

const CATEGORIES: { key: "Flights" | "Hotels" | "Packages"; icon: string; title: string; desc: string }[] = [
  { key: "Flights", icon: "✈️", title: "טיסות זולות", desc: "מצאו את הטיסה המשתלמת ביותר" },
  { key: "Hotels", icon: "🏨", title: "מלונות ונופשים", desc: "בארץ ובחו״ל, במחיר שמתאים לכם" },
  { key: "Packages", icon: "🧳", title: "חבילות נופש", desc: "טיסה + מלון במחיר מאוחד" },
];

export function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, gap: 20 }}>
      <View style={{ alignItems: "center", paddingTop: 12 }}>
        <Text style={styles.h1}>התחילו את הטיול הבא שלכם</Text>
        <Text style={styles.sub}>טיסות, מלונות וחבילות נופש - הכל במקום אחד</Text>
      </View>

      <View style={{ gap: 10 }}>
        {CATEGORIES.map((c) => (
          <Pressable key={c.key} style={styles.categoryCard} onPress={() => navigation.navigate(c.key)}>
            <Text style={styles.icon}>{c.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.categoryTitle}>{c.title}</Text>
              <Text style={styles.categoryDesc}>{c.desc}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View>
        <Text style={styles.sectionTitle}>יעדים פופולריים</Text>
        <View style={styles.destGrid}>
          {DESTINATIONS.filter((d) => d.popular).map((d) => (
            <Pressable
              key={d.id}
              style={styles.destCard}
              onPress={() => navigation.navigate("Flights", { destinationCode: d.airportCode })}
            >
              <Image source={{ uri: d.imageUrl }} style={styles.destImage} />
              <View style={styles.destOverlay}>
                <Text style={styles.destCity}>{d.city}</Text>
                <Text style={styles.destCountry}>{d.country}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.brand50 },
  h1: { fontSize: 24, fontWeight: "800", color: colors.brand900, textAlign: "center" },
  sub: { color: colors.textMuted, marginTop: 4, textAlign: "center" },
  categoryCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  icon: { fontSize: 28 },
  categoryTitle: { fontWeight: "800", fontSize: 16, color: colors.brand900, textAlign: "right" },
  categoryDesc: { fontSize: 12, color: colors.textMuted, textAlign: "right", marginTop: 2 },
  sectionTitle: { fontWeight: "800", fontSize: 18, color: colors.brand900, marginBottom: 10, textAlign: "right" },
  destGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between" },
  destCard: { width: "48%", height: 110, borderRadius: 14, overflow: "hidden" },
  destImage: { width: "100%", height: "100%" },
  destOverlay: { position: "absolute", bottom: 8, right: 10 },
  destCity: { color: colors.white, fontWeight: "800" },
  destCountry: { color: colors.white, fontSize: 11, opacity: 0.85 },
});
