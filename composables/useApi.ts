import { $fetch, FetchOptions } from "ofetch";

type RestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function useAPI() {
  const { getAuthorizationHeader, logout } = useAuth();
  const config = useRuntimeConfig();
  const url = config.public.api.base;

  async function fetch<T>(path: string, method: RestMethod, options?: FetchOptions<"json">) {
    try {
      const headers = getAuthorizationHeader();
      return await $fetch<T>(`${url}${path}`, {
        method,
        headers,
        ...options,
      });
    } catch (error) {
      if (error instanceof Error && "status" in error && error.status === 401) {
        logout();
      }
      throw error;
    }
  }

  function post<T>(path: string, data: Record<string, unknown>, options?: FetchOptions<"json">) {
    return fetch<T>(path, "POST", { body: data, ...options });
  }

  function put<T>(path: string, data: Record<string, unknown>, options?: FetchOptions<"json">) {
    return fetch<T>(path, "PUT", { body: data, ...options });
  }

  function remove<T>(path: string) {
    return fetch<T>(path, "DELETE");
  }

  function get<T>(path: string, options?: FetchOptions<"json">) {
    return fetch<T>(path, "GET", options);
  }

  return {
    post,
    put,
    get,
    remove,
    fetch,
  };
}
