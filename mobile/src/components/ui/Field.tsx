import { View, Text, TextInput, TextInputProps, StyleSheet } from "react-native";
import { colors } from "../../theme/colors";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export function FieldInput(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      textAlign="right"
      placeholderTextColor={colors.textMuted}
      style={[styles.input, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  label: { fontSize: 13, fontWeight: "600", color: colors.brand800, textAlign: "right" },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: 15,
  },
});
