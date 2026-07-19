import { useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { DESTINATIONS, HOME_AIRPORT, FlightOffer, FlightSearchParams, todayLocalIso } from "@travel-app/shared";
import { colors } from "../theme/colors";
import { Field, FieldInput } from "../components/ui/Field";
import { ChipPicker } from "../components/ui/ChipPicker";
import { Button } from "../components/ui/Button";
import { LoadingState, ErrorState, EmptyState, SourceBadge } from "../components/ui/StatusMessage";
import { FlightResultCard } from "../components/FlightResultCard";
import { apiService } from "../services/apiService";

const today = todayLocalIso();

export function FlightsScreen({ route }: any) {
  const [destinationCode, setDestinationCode] = useState<string>(route?.params?.destinationCode ?? DESTINATIONS[0].airportCode);
  const [departureDate, setDepartureDate] = useState(today);
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState("1");
  const [cabinClass, setCabinClass] = useState<FlightSearchParams["cabinClass"]>("ECONOMY");

  const [offers, setOffers] = useState<FlightOffer[]>([]);
  const [source, setSource] = useState<"live" | "mock" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const result = await apiService.searchFlights({
        originCode: HOME_AIRPORT,
        destinationCode,
        departureDate,
        returnDate: returnDate || undefined,
        adults: Number(adults) || 1,
        cabinClass,
      });
      setOffers(result.data);
      setSource(result.source);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={searched && !loading && !error ? offers : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 14, marginBottom: 14 }}>
            <Text style={styles.title}>חיפוש טיסות זולות</Text>
            <View style={styles.form}>
              <Field label="יעד">
                <ChipPicker
                  options={DESTINATIONS.map((d) => ({ value: d.airportCode, label: d.city }))}
                  value={destinationCode}
                  onChange={setDestinationCode}
                />
              </Field>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field label="תאריך יציאה">
                    <FieldInput placeholder="YYYY-MM-DD" value={departureDate} onChangeText={setDepartureDate} />
                  </Field>
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="תאריך חזרה (אופציונלי)">
                    <FieldInput placeholder="YYYY-MM-DD" value={returnDate} onChangeText={setReturnDate} />
                  </Field>
                </View>
              </View>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field label="נוסעים">
                    <FieldInput keyboardType="number-pad" value={adults} onChangeText={setAdults} />
                  </Field>
                </View>
              </View>
              <Field label="מחלקה">
                <ChipPicker
                  options={[
                    { value: "ECONOMY", label: "אקונומי" },
                    { value: "PREMIUM_ECONOMY", label: "פרימיום" },
                    { value: "BUSINESS", label: "ביזנס" },
                    { value: "FIRST", label: "ראשונה" },
                  ]}
                  value={cabinClass ?? "ECONOMY"}
                  onChange={(v) => setCabinClass(v as FlightSearchParams["cabinClass"])}
                />
              </Field>
              <Button title={loading ? "מחפש..." : "חיפוש טיסות"} onPress={handleSearch} disabled={loading} />
            </View>

            {loading && <LoadingState label="מחפש טיסות..." />}
            {error && <ErrorState message={error} />}
            {!loading && !error && searched && source && (
              <View style={styles.resultsHeader}>
                <SourceBadge source={source} />
                <Text style={styles.resultsCount}>{offers.length} טיסות נמצאו</Text>
              </View>
            )}
            {!loading && !error && searched && offers.length === 0 && (
              <EmptyState message="לא נמצאו טיסות. נסו לשנות את החיפוש." />
            )}
          </View>
        }
        renderItem={({ item }) => <FlightResultCard offer={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.brand50 },
  title: { fontSize: 20, fontWeight: "800", color: colors.brand900, textAlign: "right" },
  form: { backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 12 },
  row: { flexDirection: "row-reverse", gap: 10 },
  resultsHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" },
  resultsCount: { color: colors.textMuted, fontSize: 13 },
});
