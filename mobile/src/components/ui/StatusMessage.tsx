import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export function LoadingState({ label }: { label: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.brand500} size="large" />
      <Text style={styles.mutedText}>{label}</Text>
    </View>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <View style={[styles.box, { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}>
      <Text style={{ color: colors.danger, textAlign: "center" }}>{message}</Text>
    </View>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={[styles.box, { backgroundColor: colors.brand50, borderColor: colors.brand200 }]}>
      <Text style={{ color: colors.brand700, textAlign: "center" }}>{message}</Text>
    </View>
  );
}

export function SourceBadge({ source }: { source: "live" | "mock" }) {
  const live = source === "live";
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: live ? colors.successBg : colors.amberBg, borderColor: live ? colors.success : colors.amber },
      ]}
    >
      <Text style={{ color: live ? colors.success : colors.amber, fontSize: 12, fontWeight: "600" }}>
        {live ? "נתונים חיים מה-API" : "נתוני הדגמה (Mock)"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center", paddingVertical: 48, gap: 10 },
  mutedText: { color: colors.textMuted },
  box: { borderWidth: 1, borderRadius: 16, padding: 16 },
  badge: { alignSelf: "flex-start", borderWidth: 1, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 10 },
});
