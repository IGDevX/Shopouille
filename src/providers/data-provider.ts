import type { DataProvider } from "@refinedev/core";

/*
  Define all the methods to fetch the api
  you can add or edit methods
*/
export const dataProvider: DataProvider = {
  getOne: async ({ resource, id }) => {
    // BAD PATTERN BUT TEMPORARY UNTIL WE HAVE A GATEWAY
    let baseUrl = import.meta.env.VITE_API_URL;
    switch (resource) {
      case "theme-settings":
        baseUrl = import.meta.env.VITE_CMS_API_URL;
        // theme-settings doesn't use id in the URL
        break;
      case "page-content":
        baseUrl = import.meta.env.VITE_CMS_API_URL;
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
    let baseUrl = import.meta.env.VITE_API_URL;
    switch (resource) {
      case "theme-settings":
        baseUrl = import.meta.env.VITE_CMS_API_URL;
        break;
      case "page-content":
        baseUrl = import.meta.env.VITE_CMS_API_URL;
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
    let baseUrl = import.meta.env.VITE_API_URL;
    switch (resource) {
      case "theme-settings":
        baseUrl = import.meta.env.VITE_CMS_API_URL;
        // theme-settings doesn't use id in the URL
        break;
      case "page-content":
        baseUrl = import.meta.env.VITE_CMS_API_URL;
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
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    return { data };
  },

  getList: async ({ resource, pagination, sorters, filters }) => {
    let baseUrl = import.meta.env.VITE_API_URL;
    switch (resource) {
      case "theme-settings":
        baseUrl = import.meta.env.VITE_CMS_API_URL;
        break;
      case "page-content":
        baseUrl = import.meta.env.VITE_CMS_API_URL;
        break;
      default:
        break;
    }
    const params = new URLSearchParams();

    if (pagination?.currentPage && pagination?.pageSize) {
      params.append("pageIndex", String(pagination.currentPage - 1));
      params.append("pageSize", String(pagination.pageSize));
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

    const url =
      params.size > 0
        ? `${baseUrl}/${resource}?${params}`
        : `${baseUrl}/${resource}`;
    const response = await fetch(url);

    if (response.status < 200 || response.status > 299) throw response;
    const data = await response.json();
    const total = Number(response.headers.get("x-total-count"));

    return { data, total };
  },

  create: async ({ resource, variables }) => {
    let baseUrl = import.meta.env.VITE_API_URL;
    switch (resource) {
      case "theme-settings":
        baseUrl = import.meta.env.VITE_CMS_API_URL;
        break;
      case "page-content":
        baseUrl = import.meta.env.VITE_CMS_API_URL;
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
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/${resource}/${id}`,
      {
        method: "DELETE",
      }
    );

    if (response.status < 200 || response.status > 299) throw response;
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    return { data };
  },
  getApiUrl: () => import.meta.env.VITE_API_URL,
};
