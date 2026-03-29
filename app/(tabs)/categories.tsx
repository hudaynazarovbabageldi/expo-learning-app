import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function CategoriesPage() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Categories</ThemedText>
      <ThemedText>Browse products by category.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
});
