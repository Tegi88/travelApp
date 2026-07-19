import { ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export interface ChipOption {
  value: string;
  label: string;
}

export function ChipPicker({
  options,
  value,
  onChange,
}: {
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row-reverse", gap: 8, paddingVertical: 2 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  chipActive: {
    backgroundColor: colors.brand500,
    borderColor: colors.brand500,
  },
  chipLabel: { color: colors.brand800, fontSize: 13, fontWeight: "600" },
  chipLabelActive: { color: colors.white },
});
