import api from "@/api/api";
import { PaginationType } from "@/types/Pagination.type";
import { ResponseType } from "@/types/Response.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ProductType } from "../types/Product.type";

type GetProductsParams = {
  categoryId?: string;
  limit?: number;
};

type GetProductsRequestParams = GetProductsParams & {
  page: number;
};

export type ProductsPage = {
  items: ProductType[];
  pagination: PaginationType;
};

const DEFAULT_LIMIT = 10;

const getProducts = async (
  params: GetProductsRequestParams,
): Promise<ProductsPage> => {
  const limit = params.limit ?? DEFAULT_LIMIT;

  const response = await api.get<ResponseType<ProductType[]>>("/products", {
    params: {
      limit,
      offset: (params.page - 1) * limit,
      categoryId: params.categoryId,
    },
  });

  const payload = response.data.data;

  return {
    items: payload.data,
    pagination: payload.pagination ?? {
      page: params.page,
      limit,
      total: payload.data.length,
      totalPages: 1,
    },
  };
};

export function useGetProducts(params: GetProductsParams) {
  return useInfiniteQuery({
    queryKey: ["getProducts", params],
    queryFn: ({ pageParam = 1 }) => getProducts({ ...params, page: pageParam }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined;
    },

    getPreviousPageParam: (firstPage) => {
      return firstPage.pagination.page > 1
        ? firstPage.pagination.page - 1
        : undefined;
    },

    staleTime: 1000 * 60 * 5,
  });
}
