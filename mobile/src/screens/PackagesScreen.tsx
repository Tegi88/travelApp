import { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { DESTINATIONS, HOME_AIRPORT, VacationPackage, todayLocalIso, addDaysLocalIso } from "@travel-app/shared";
import { colors } from "../theme/colors";
import { Field, FieldInput } from "../components/ui/Field";
import { ChipPicker } from "../components/ui/ChipPicker";
import { Button } from "../components/ui/Button";
import { LoadingState, ErrorState, EmptyState, SourceBadge } from "../components/ui/StatusMessage";
import { PackageResultCard } from "../components/PackageResultCard";
import { apiService } from "../services/apiService";

const today = todayLocalIso();
const inAWeek = addDaysLocalIso(7);

export function PackagesScreen() {
  const [destinationCode, setDestinationCode] = useState<string>("");
  const [departureDate, setDepartureDate] = useState(today);
  const [returnDate, setReturnDate] = useState(inAWeek);
  const [adults, setAdults] = useState("2");
  const [maxBudget, setMaxBudget] = useState("");

  const [packages, setPackages] = useState<VacationPackage[]>([]);
  const [source, setSource] = useState<"live" | "mock" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const result = await apiService.searchPackages({
        originCode: HOME_AIRPORT,
        destinationCode: destinationCode || undefined,
        departureDate,
        returnDate,
        adults: Number(adults) || 1,
        maxBudget: maxBudget ? Number(maxBudget) : undefined,
      });
      setPackages(result.data);
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
        data={searched && !loading && !error ? packages : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 14, marginBottom: 14 }}>
            <Text style={styles.title}>חבילות נופש - טיסה + מלון</Text>
            <View style={styles.form}>
              <Field label="יעד">
                <ChipPicker
                  options={[{ value: "", label: "כל היעדים" }, ...DESTINATIONS.map((d) => ({ value: d.airportCode, label: d.city }))]}
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
                  <Field label="תאריך חזרה">
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
                <View style={{ flex: 1 }}>
                  <Field label="תקציב מקסימלי לאדם">
                    <FieldInput keyboardType="number-pad" placeholder="ללא הגבלה" value={maxBudget} onChangeText={setMaxBudget} />
                  </Field>
                </View>
              </View>
              <Button title={loading ? "מחפש..." : "חיפוש חבילות"} onPress={handleSearch} disabled={loading} />
            </View>

            {loading && <LoadingState label="מחפש חבילות נופש..." />}
            {error && <ErrorState message={error} />}
            {!loading && !error && searched && source && (
              <View style={styles.resultsHeader}>
                <SourceBadge source={source} />
                <Text style={styles.resultsCount}>{packages.length} חבילות נמצאו</Text>
              </View>
            )}
            {!loading && !error && searched && packages.length === 0 && (
              <EmptyState message="לא נמצאו חבילות. נסו לשנות את התאריכים או התקציב." />
            )}
          </View>
        }
        renderItem={({ item }) => <PackageResultCard pkg={item} />}
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
