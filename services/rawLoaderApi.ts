import axios from "axios";

export type RawLoader = {
  Date: string;
  LoaderID: string;
  LoaderName: string;
  LoaderType: string;
  Partner: string;
  Pending: number;
  TotalMembers: number;
  actions?: string;
};



// Axios instance
const api = axios.create({
  baseURL: "https://your-backend-url.com", // replace with actual backend
});

// Simulated in-memory data
let dummyRawLoaders: RawLoader[] = Array.from({ length: 50 }, (_, i) => ({
  Date: `2024-07-${(i % 28) + 1}`,
  LoaderID: `LOADER${1000 + i}`,
  LoaderName: ["CAG.CSV", "Credila _Updated", "Credit_access_granted"][i % 3],
  LoaderType: ["Pending", "Completed", "Failed"][i % 3],
  Partner: `PP0000${95 + (i % 5)}`,
  TotalMembers: 5 + i * 10,
  Pending: i % 5,
  actions: "Download",
}));

export default {
  /**
   * Simulate GET /api/raw-loaders?page=1&pageSize=10&search=abc
   */
  get: async (url: string) => {
    if (url.startsWith("/api/raw-loaders")) {
      const urlObj = new URL(`http://localhost${url}`);
      const page = parseInt(urlObj.searchParams.get("page") || "1", 10);
      const pageSize = parseInt(urlObj.searchParams.get("pageSize") || "10", 10);
      const search = urlObj.searchParams.get("search")?.toLowerCase() || "";

      let filtered = [...dummyRawLoaders];
      if (search) {
        filtered = filtered.filter((loader) =>
          loader.LoaderName.toLowerCase().includes(search) ||
          loader.LoaderID.toLowerCase().includes(search) ||
          loader.LoaderType.toLowerCase().includes(search) ||
          loader.Partner.toLowerCase().includes(search)
        );
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginated = filtered.slice(start, end);

      return {
        data: paginated,
        total: filtered.length,
        page,
        pageSize,
      };
    }

    // fallback to real API
    const response = await api.get(url);
    return response.data;
  }
};
