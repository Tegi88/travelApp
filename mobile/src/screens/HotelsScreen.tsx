import { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ALL_DESTINATIONS, HotelOffer, todayLocalIso, addDaysLocalIso } from "@travel-app/shared";
import { colors } from "../theme/colors";
import { Field, FieldInput } from "../components/ui/Field";
import { ChipPicker } from "../components/ui/ChipPicker";
import { Button } from "../components/ui/Button";
import { LoadingState, ErrorState, EmptyState, SourceBadge } from "../components/ui/StatusMessage";
import { HotelResultCard } from "../components/HotelResultCard";
import { apiService } from "../services/apiService";

const today = todayLocalIso();
const inAWeek = addDaysLocalIso(7);

export function HotelsScreen() {
  const [destinationId, setDestinationId] = useState(ALL_DESTINATIONS[0].id);
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(inAWeek);
  const [adults, setAdults] = useState("2");

  const [hotels, setHotels] = useState<HotelOffer[]>([]);
  const [source, setSource] = useState<"live" | "mock" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    const dest = ALL_DESTINATIONS.find((d) => d.id === destinationId)!;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const result = await apiService.searchHotels({
        destinationCode: dest.airportCode || dest.id,
        destinationCity: dest.city,
        destinationCityEn: dest.cityEn,
        checkInDate,
        checkOutDate,
        adults: Number(adults) || 1,
      });
      setHotels(result.data);
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
        data={searched && !loading && !error ? hotels : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 14, marginBottom: 14 }}>
            <Text style={styles.title}>חיפוש מלונות ונופשים</Text>
            <View style={styles.form}>
              <Field label="יעד">
                <ChipPicker
                  options={ALL_DESTINATIONS.map((d) => ({ value: d.id, label: d.city }))}
                  value={destinationId}
                  onChange={setDestinationId}
                />
              </Field>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field label="צ'ק-אין">
                    <FieldInput placeholder="YYYY-MM-DD" value={checkInDate} onChangeText={setCheckInDate} />
                  </Field>
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="צ'ק-אאוט">
                    <FieldInput placeholder="YYYY-MM-DD" value={checkOutDate} onChangeText={setCheckOutDate} />
                  </Field>
                </View>
              </View>
              <Field label="אורחים">
                <FieldInput keyboardType="number-pad" value={adults} onChangeText={setAdults} />
              </Field>
              <Button title={loading ? "מחפש..." : "חיפוש מלונות"} onPress={handleSearch} disabled={loading} />
            </View>

            {loading && <LoadingState label="מחפש מלונות..." />}
            {error && <ErrorState message={error} />}
            {!loading && !error && searched && source && (
              <View style={styles.resultsHeader}>
                <SourceBadge source={source} />
                <Text style={styles.resultsCount}>{hotels.length} מלונות נמצאו</Text>
              </View>
            )}
            {!loading && !error && searched && hotels.length === 0 && (
              <EmptyState message="לא נמצאו מלונות. נסו לשנות את החיפוש." />
            )}
          </View>
        }
        renderItem={({ item }) => <HotelResultCard hotel={item} />}
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
