type FetchOptions = RequestInit & {
  baseUrl?: string; // Optional base URL for flexibility
  token?: string; // Authorization token
};

type FetchResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const fetchFromStrapi = async <T = unknown>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<FetchResponse<T>> => {
  const {
    baseUrl = process.env.STRAPI_BASE_URL,
    token,
    headers,
    ...fetchOptions
  } = options;
  const url = `${baseUrl}${endpoint}`;

  // Add Authorization header if a token is provided
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...headers,
        ...authHeaders, // Merge user-provided headers with authorization header
      },
    });

    // Handle successful responses
    if (response.ok) {
      try {
        const payload = await response.json();

        // If payload has a top-level `data` object, return it, otherwise return the whole payload
        const data = payload.data !== undefined ? payload.data : payload;

        return { success: true, data };
      } catch (error) {
        // No JSON body, return success without data
        return { success: true };
      }
    }

    // Handle errors
    const statusText = response.statusText || "Unknown error";
    const errorStatus = `Error ${response.status}: ${statusText}`;

    // Try parsing error details from JSON
    try {
      const errorData = await response.json();
      return { success: false, error: errorData?.error.message || errorStatus };
    } catch (error) {
      // Fallback for responses with no JSON body
      return { success: false, error: errorStatus };
    }
  } catch (error) {
    // Handle fetch network errors
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
};

export default fetchFromStrapi;
