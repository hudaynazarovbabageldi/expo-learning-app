import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useGetProduct } from "@/services/products/services/useGetProduct.query";

function formatPrice(value: string) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return value;
  }

  return `$${amount.toFixed(2)}`;
}

export default function ProductDetailsPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const productId = Array.isArray(id) ? id[0] : id;
  const { data: product, error, isLoading } = useGetProduct(productId ?? "");
  const heroImage = product?.thumbnail || product?.images?.[0];

  if (isLoading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !product) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">Product not found</ThemedText>
        <ThemedText themeColor="textSecondary">
          {error instanceof Error
            ? error.message
            : "The requested product could not be loaded."}
        </ThemedText>
      </ThemedView>
    );
  }

  console.log("productItemData: ", product);

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.container}>
        {heroImage ? (
          <Image
            contentFit="cover"
            source={{ uri: heroImage }}
            style={styles.image}
          />
        ) : (
          <ThemedView type="backgroundElement" style={styles.imageFallback}>
            <ThemedText>No image available</ThemedText>
          </ThemedView>
        )}

        <View style={styles.header}>
          <ThemedText type="title">{product.name}</ThemedText>
          <ThemedText type="subtitle">{formatPrice(product.price)}</ThemedText>
          <ThemedText themeColor="textSecondary">
            {product.category?.name ?? "Uncategorized"}
          </ThemedText>
        </View>

        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText type="smallBold">Description</ThemedText>
          <ThemedText>
            {product.description || product.shortDescription}
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText type="smallBold">Details</ThemedText>
          <ThemedText>SKU: {product.sku}</ThemedText>
          <ThemedText>Stock: {product.stock}</ThemedText>
          <ThemedText>Rating: {product.rating}</ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    flex: 1,
    gap: 8,
    justifyContent: "center",
    padding: 16,
  },
  container: {
    flex: 1,
    gap: 16,
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    gap: 8,
  },
  image: {
    borderRadius: 24,
    height: 320,
    width: "100%",
  },
  imageFallback: {
    alignItems: "center",
    borderRadius: 24,
    height: 320,
    justifyContent: "center",
  },
  section: {
    borderRadius: 20,
    gap: 8,
    padding: 16,
  },
});
