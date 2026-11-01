import { api } from "../../app/api";

export const applicationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyApplications: builder.query({
      query: () => "/applications",
      providesTags: ["Application"],
    }),

    createApplication: builder.mutation({
      query: (body) => ({
        url: "/applications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Application"],
    }),

    updateApplication: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/applications/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Application"],
    }),

    deleteApplication: builder.mutation({
      query: (id) => ({
        url: `/applications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Application"],
    }),
  }),
});

export const {
  useGetMyApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
} = applicationsApi;