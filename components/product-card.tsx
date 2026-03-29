import { ProductType } from "@/services/products/types/Product.type";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type ProductCardProps = {
  onPress?: () => void;
  product: ProductType;
};

function formatPrice(value: string) {
  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return value;
  }

  return `$${amount.toFixed(2)}`;
}

export function ProductCard({ onPress, product }: ProductCardProps) {
  const imageSource = product.thumbnail || product.images?.[0];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.cardWrapper, pressed && styles.pressed]}
    >
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          {imageSource ? (
            <Image
              source={{ uri: imageSource }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imageFallback}>
              <Text style={styles.small}>No image</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text numberOfLines={1} style={styles.title}>
            {product.name}
          </Text>

          <Text numberOfLines={2} style={styles.description}>
            {product.shortDescription || product.description}
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>

            <Text style={styles.category}>
              {product.category?.name ?? "Uncategorized"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 20,
    overflow: "hidden",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrapper: {
    overflow: "hidden",
  },
  image: {
    height: 180,
    width: "100%",
  },
  imageFallback: {
    alignItems: "center",
    justifyContent: "center",
    height: 180,
    backgroundColor: "#eee",
  },
  content: {
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    color: "#666",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
  },
  category: {
    fontSize: 12,
    color: "#888",
  },
  small: {
    fontSize: 12,
    color: "#888",
  },
  pressed: {
    opacity: 0.85,
  },
});
