import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ProductCard } from "@/components/product-card";
import { useGetProduct } from "@/services/products/services/useGetProduct.query";
import { useGetProducts } from "@/services/products/services/useGetProducts.query";
import { ProductType } from "@/services/products/types/Product.type";

export default function HomePage() {
  const navigation = useNavigation();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useGetProducts({ limit: 10 });

  const productDetailData = useGetProduct(
    "fc02b6f7-8960-4a40-9ba8-ec4b4b58dcac",
  );

  const products = data?.pages.flatMap((page) => page.items) ?? [];

  const renderItem = ({ item }: { item: ProductType }) => (
    <View style={styles.cardWrapper}>
      <ProductCard
        onPress={() =>
          navigation.navigate("products/[id]", {
            id: item.id,
          })
        }
        product={item}
      />
    </View>
  );
  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error instanceof Error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.subtitle}>Could not load products</Text>
        <Text style={styles.secondary}>{error.message}</Text>
        <Text style={styles.link} onPress={() => refetch()}>
          Try again
        </Text>
      </View>
    );
  }

  console.log("productItemData: ", productDetailData?.data);

  return (
    <>
      <Text>Most Liked Products</Text>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>HomePage</Text>
            <Text style={styles.secondary}>
              Browse the latest products and open any card for full details.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.subtitle}>No products yet</Text>
            <Text style={styles.secondary}>
              Products will appear here when the API returns data.
            </Text>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator />
            </View>
          ) : (
            <View style={styles.footerSpacing} />
          )
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  contentContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  footer: {
    paddingVertical: 12,
  },
  footerSpacing: {
    height: 12,
  },
  header: {
    marginBottom: 8,
    marginTop: 24,
  },
  list: {
    flex: 1,
  },

  // 👇 simple text styles instead of themed components
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondary: {
    color: "#666",
    marginTop: 4,
  },
  link: {
    color: "blue",
    marginTop: 8,
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 12,
    marginHorizontal: 4,
  },
});
