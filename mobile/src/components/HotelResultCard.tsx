import { View, Text, Image, StyleSheet, Linking } from "react-native";
import { HotelOffer, formatPrice } from "@travel-app/shared";
import { colors } from "../theme/colors";
import { Button } from "./ui/Button";

export function HotelResultCard({ hotel }: { hotel: HotelOffer }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: hotel.imageUrl }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {hotel.name}
        </Text>
        <Text style={styles.stars}>{"★".repeat(hotel.starRating)}</Text>
        <Text style={styles.address} numberOfLines={1}>
          {hotel.address}
        </Text>
        <Text style={styles.roomType}>{hotel.roomType}</Text>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Text style={styles.ratingScore}>{hotel.guestRating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>{hotel.reviewCount.toLocaleString("he-IL")} ביקורות</Text>
          </View>
          <View style={{ alignItems: "flex-end", gap: 6 }}>
            <Text style={styles.price}>{formatPrice(hotel.price.perNight, hotel.price.currency)}</Text>
            <Button title="הזמנה ב-Booking.com" onPress={() => hotel.bookingUrl && Linking.openURL(hotel.bookingUrl)} />
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
  body: { padding: 12, gap: 4 },
  name: { fontWeight: "800", fontSize: 15, color: colors.text, textAlign: "right" },
  stars: { color: "#f59e0b", textAlign: "right" },
  address: { fontSize: 12, color: colors.textMuted, textAlign: "right" },
  roomType: { fontSize: 13, color: colors.text, textAlign: "right" },
  footer: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  rating: { alignItems: "flex-start" },
  ratingScore: {
    backgroundColor: colors.brand700,
    color: colors.white,
    fontWeight: "800",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    overflow: "hidden",
  },
  reviewCount: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  price: { fontSize: 18, fontWeight: "800", color: colors.brand700 },
});
