type ConfigObject = {
  body?: Record<string, unknown>;
  token?: string;
  method?: "POST" | "DELETE" | "GET" | "PUT" | "PATCH";
  configHeaders?: Record<string, unknown>;
  otherConfig?: Record<string, unknown>;
};

type HeadersInit = Headers | string[][] | Record<string, string>;

export default async function client(
  endpoint: string,
  { body, token, method, configHeaders, otherConfig }: ConfigObject = {}
) {
  const BASE_URL = process.env.API_BASE_URL ?? "";
  const sanitizedBaseUrl = BASE_URL.endsWith("/")
    ? BASE_URL.slice(0, -1)
    : BASE_URL;
  const sanitizedEndpoint = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;

  const requestHeaders: HeadersInit = {
    "content-type": "application/json",
  };
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const config: Record<string, unknown> = {
    method: method ?? (body ? "POST" : "GET"),
    ...otherConfig,
    headers: {
      ...requestHeaders,
      ...configHeaders,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(`${sanitizedBaseUrl}/${sanitizedEndpoint}`, config)
    .then(async (response: Response) => {
      if (response.status === 401) {
        return;
      }
      if (response.ok) {
        return await response.json();
      } else {
        const errorMessage = await response.text();
        return Promise.reject(new Error(errorMessage));
      }
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}
