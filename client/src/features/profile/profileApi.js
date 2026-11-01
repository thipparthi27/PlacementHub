import { api } from "../../app/api";

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/users/profile",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useUpdateProfileMutation } = profileApi;