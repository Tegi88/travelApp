import { View, Text, StyleSheet, Linking } from "react-native";
import { FlightOffer, formatDuration, formatPrice, formatTime, stopsLabel } from "@travel-app/shared";
import { colors } from "../theme/colors";
import { Button } from "./ui/Button";

function ItineraryRow({ itinerary, label }: { itinerary: FlightOffer["outbound"]; label: string }) {
  const first = itinerary.segments[0];
  const last = itinerary.segments[itinerary.segments.length - 1];
  return (
    <View style={styles.itineraryRow}>
      <Text style={styles.itineraryLabel}>{label}</Text>
      <View style={styles.timeBlock}>
        <Text style={styles.time}>{formatTime(first.departureTime)}</Text>
        <Text style={styles.airport}>{first.departureAirport}</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.duration}>{formatDuration(itinerary.durationMinutes)}</Text>
        <View style={styles.line} />
        <Text style={styles.stops}>{stopsLabel(itinerary.stops)}</Text>
      </View>
      <View style={styles.timeBlock}>
        <Text style={styles.time}>{formatTime(last.arrivalTime)}</Text>
        <Text style={styles.airport}>{last.arrivalAirport}</Text>
      </View>
    </View>
  );
}

export function FlightResultCard({ offer }: { offer: FlightOffer }) {
  return (
    <View style={styles.card}>
      <ItineraryRow itinerary={offer.outbound} label="הלוך" />
      {offer.inbound && <ItineraryRow itinerary={offer.inbound} label="חזור" />}
      <View style={styles.footer}>
        <Text style={styles.airline}>{offer.airlineName}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(offer.price.perPerson, offer.price.currency)}</Text>
          <Button title="הזמנה ב-Google Flights" onPress={() => offer.bookingUrl && Linking.openURL(offer.bookingUrl)} />
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
    padding: 14,
    gap: 8,
  },
  itineraryRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  itineraryLabel: { fontSize: 11, color: colors.textMuted, width: 30 },
  timeBlock: { alignItems: "center", width: 56 },
  time: { fontWeight: "800", color: colors.text },
  airport: { fontSize: 11, color: colors.textMuted },
  middle: { flex: 1, alignItems: "center" },
  duration: { fontSize: 11, color: colors.textMuted },
  line: { height: 1, backgroundColor: colors.brand200, width: "100%", marginVertical: 4 },
  stops: { fontSize: 11, color: colors.brand500, fontWeight: "600" },
  footer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.brand50,
    paddingTop: 10,
    marginTop: 4,
  },
  airline: { fontSize: 12, color: colors.textMuted },
  priceRow: { flexDirection: "row-reverse", alignItems: "center", gap: 10 },
  price: { fontSize: 18, fontWeight: "800", color: colors.brand700 },
});
