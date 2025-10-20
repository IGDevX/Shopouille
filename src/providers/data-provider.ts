import type { DataProvider } from "@refinedev/core";

const API_URL = "https://api.fake-rest.refine.dev";

export const dataProvider: DataProvider = {
  getOne: async ({ resource, id }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`);

    if (response.status < 200 || response.status > 299) throw response;
    const data = await response.json();
    return { data };
  },

  getMany: async ({ resource, ids }) => {
    const params = new URLSearchParams();

    if (ids) {
      for (const id in ids) {
        params.append("id", id);
      }
    }

    const response = await fetch(`${API_URL}/${resource}?${params.toString()}`);
    if (response.status < 200 || response.status > 299) throw response;
    const data = await response.json();
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const response = await fetch(`${API_URL}/${resource}/${id}`, {
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

    const url = `${API_URL}/${resource}?${params}`;

    const response = await fetch(url);

    if (response.status < 200 || response.status > 299) throw response;
    const data = await response.json();
    const total = Number(response.headers.get("x-total-count"));

    return { data, total };
  },

  create: async ({ resource, variables }) => {
    const response = await fetch(`${API_URL}/${resource}`, {
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
  getApiUrl: () => API_URL,
};
