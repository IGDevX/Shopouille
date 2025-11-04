import type { DataProvider } from "@refinedev/core";

// BAD PATTERN BUT TEMPORARY UNTIL WE HAVE A GATEWAY
const API_URL = "https://api.fake-rest.refine.dev";
const CMS_API_URL = "http://localhost:8080/api";

/*
  Define all the methods to fetch the api
  you can add or edit methods
*/
export const dataProvider: DataProvider = {
  getOne: async ({ resource, id }) => {
    // BAD PATTERN BUT TEMPORARY UNTIL WE HAVE A GATEWAY
    let baseUrl = API_URL;
    switch (resource) {
      case "theme-settings":
        baseUrl = CMS_API_URL;
        // theme-settings doesn't use id in the URL
        break;
      case "page-content":
        baseUrl = CMS_API_URL;
        break;
      default:
        break;
    }

    // For theme-settings, always use the base resource URL without id
    const url =
      resource === "theme-settings"
        ? `${baseUrl}/${resource}`
        : `${baseUrl}/${resource}/${id}`;

    const response = await fetch(url);

    if (response.status < 200 || response.status > 299) throw response;
    const data = await response.json();
    return { data };
  },

  getMany: async ({ resource, ids }) => {
    // BAD PATTERN BUT TEMPORARY UNTIL WE HAVE A GATEWAY
    let baseUrl = API_URL;
    switch (resource) {
      case "theme-settings":
        baseUrl = CMS_API_URL;
        break;
      case "page-content":
        baseUrl = CMS_API_URL;
        break;
      default:
        break;
    }

    const params = new URLSearchParams();

    if (ids) {
      for (const id in ids) {
        params.append("id", id);
      }
    }

    const response = await fetch(`${baseUrl}/${resource}?${params.toString()}`);
    if (response.status < 200 || response.status > 299) throw response;
    const data = await response.json();
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    // BAD PATTERN BUT TEMPORARY UNTIL WE HAVE A GATEWAY
    let baseUrl = API_URL;
    switch (resource) {
      case "theme-settings":
        baseUrl = CMS_API_URL;
        // theme-settings doesn't use id in the URL
        break;
      case "page-content":
        baseUrl = CMS_API_URL;
        break;
      default:
        break;
    }
    // For theme-settings, always use the base resource URL without id
    const url =
      resource === "theme-settings"
        ? `${baseUrl}/${resource}`
        : id
        ? `${baseUrl}/${resource}/${id}`
        : `${baseUrl}/${resource}`;

    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;
    const data = await response.json();
    return { data };
  },

  getList: async ({ resource, pagination, sorters, filters }) => {
    // BAD PATTERN BUT TEMPORARY UNTIL WE HAVE A GATEWAY
    let baseUrl = API_URL;
    switch (resource) {
      case "theme-settings":
        baseUrl = CMS_API_URL;
        break;
      case "page-content":
        baseUrl = CMS_API_URL;
        break;
      default:
        break;
    }
    const params = new URLSearchParams();

    if (pagination?.currentPage && pagination?.pageSize) {
      params.append(
        "_start",
        String((pagination.currentPage - 1) * pagination.pageSize)
      );
      params.append(
        "_end",
        String(pagination.currentPage * pagination.pageSize)
      );
    }

    if (sorters?.length) {
      params.append("_sort", sorters.map((sorters) => sorters.field).join(","));
      params.append(
        "_order",
        sorters.map((sorters) => sorters.order).join(",")
      );
    }

    if (filters?.length && filters.length > 0) {
      for (const filter of filters) {
        if ("field" in filter && filter.operator == "eq") {
          params.append(filter.field, filter.value);
        }
      }
    }

    const url = `${baseUrl}/${resource}?${params}`;

    const response = await fetch(url);

    if (response.status < 200 || response.status > 299) throw response;
    const data = await response.json();
    const total = Number(response.headers.get("x-total-count"));

    return { data, total };
  },

  create: async ({ resource, variables }) => {
    // BAD PATTERN BUT TEMPORARY UNTIL WE HAVE A GATEWAY
    let baseUrl = API_URL;
    switch (resource) {
      case "theme-settings":
        baseUrl = CMS_API_URL;
        break;
      case "page-content":
        baseUrl = CMS_API_URL;
        break;
      default:
        break;
    }
    const response = await fetch(`${baseUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;
    const data = await response.json();
    return { data };
  },

  deleteOne: () => {
    throw new Error("Not implemented");
  },

  getApiUrl: () => {
    return API_URL;
  },
};
