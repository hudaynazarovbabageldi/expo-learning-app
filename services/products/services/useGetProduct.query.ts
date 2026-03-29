import api from "@/api/api";
import { ResponseType } from "@/types/Response.type";
import { useQuery } from "@tanstack/react-query";
import { ProductItemType } from "../types/Product.item.type";

const getProduct = async (id: string) => {
  const response = await api.get<ResponseType<ProductItemType>>(
    `/products/${id}`,
  );

  return response.data.data;
};

console.log("responseData: ", getProduct); // Debugging log to check the getProduct function

export function useGetProduct(id: string) {
  return useQuery({
    queryKey: ["getProduct", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}
