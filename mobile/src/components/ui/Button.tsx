import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../../theme/colors";

export function Button({
  title,
  onPress,
  disabled,
  variant = "primary",
  style,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, variant === "secondary" && styles.secondary, disabled && styles.disabled, style]}
    >
      <Text style={[styles.label, variant === "secondary" && styles.secondaryLabel]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand500,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.brand500,
  },
  disabled: {
    backgroundColor: colors.brand200,
  },
  label: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
  secondaryLabel: {
    color: colors.brand600,
  },
});
