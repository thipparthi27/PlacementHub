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

    createDrive: builder.mutation({
      query: (body) => ({ url: "/drives", method: "POST", body }),
      invalidatesTags: ["Drive"],
    }),

    updateDrive: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/drives/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Drive"],
    }),

    deleteDrive: builder.mutation({
      query: (id) => ({ url: `/drives/${id}`, method: "DELETE" }),
      invalidatesTags: ["Drive", "Application"],
    }),
  }),
});

export const {
  useGetDrivesQuery,
  useGetDriveQuery,
  useCreateDriveMutation,
  useUpdateDriveMutation,
  useDeleteDriveMutation,
} = drivesApi;