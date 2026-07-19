import { View, Text, Image, StyleSheet, Linking } from "react-native";
import { VacationPackage, formatPrice, formatDate, stopsLabel } from "@travel-app/shared";
import { colors } from "../theme/colors";
import { Button } from "./ui/Button";

export function PackageResultCard({ pkg }: { pkg: VacationPackage }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: pkg.imageUrl }} style={styles.image} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{pkg.nights} לילות</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>
          {pkg.destinationCity}, {pkg.destinationCountry}
        </Text>
        <Text style={styles.dates}>
          {formatDate(pkg.departureDate)} - {formatDate(pkg.returnDate)}
        </Text>
        <Text style={styles.line}>✈️ {pkg.flight.airlineName} · {stopsLabel(pkg.flight.outbound.stops)}</Text>
        <Text style={styles.line}>🏨 {pkg.hotel.name} ({pkg.hotel.starRating}★)</Text>
        <View style={styles.footer}>
          {pkg.price.savingsVsSeparate > 0 && (
            <Text style={styles.savings}>חסכון {formatPrice(pkg.price.savingsVsSeparate, pkg.price.currency)}</Text>
          )}
          <View style={{ alignItems: "flex-end", gap: 6 }}>
            <Text style={styles.price}>{formatPrice(pkg.price.perPerson, pkg.price.currency)}</Text>
            <Button title="הזמנת טיסה" onPress={() => pkg.flight.bookingUrl && Linking.openURL(pkg.flight.bookingUrl)} />
            <Button
              title="הזמנת מלון"
              variant="secondary"
              onPress={() => pkg.hotel.bookingUrl && Linking.openURL(pkg.hotel.bookingUrl)}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  image: { width: "100%", height: 150 },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: colors.brand800 },
  body: { padding: 12, gap: 4 },
  title: { fontWeight: "800", fontSize: 16, color: colors.text, textAlign: "right" },
  dates: { fontSize: 12, color: colors.textMuted, textAlign: "right" },
  line: { fontSize: 13, color: colors.text, textAlign: "right", marginTop: 2 },
  footer: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  savings: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.success,
    backgroundColor: colors.successBg,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  price: { fontSize: 18, fontWeight: "800", color: colors.brand700 },
});
