import { PaginationType } from "./Pagination.type";

export type ResponseType<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    data: T;
    pagination?: PaginationType;
  };
};
