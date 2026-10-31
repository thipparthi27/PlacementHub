import { api } from "../../app/api";

export const drivesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDrives: builder.query({
      query: (params) => ({ url: "/drives", params }),
      providesTags: ["Drive"],
    }),
    getDrive: builder.query({
      query: (id) => `/drives/${id}`,
      providesTags: (result, error, id) => [{ type: "Drive", id }],
    }),
  }),
});

export const { useGetDrivesQuery, useGetDriveQuery } = drivesApi;