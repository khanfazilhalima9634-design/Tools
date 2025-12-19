import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertAnalysis } from "@shared/routes";

export function useAnalysisHistory() {
  return useQuery({
    queryKey: [api.analyze.list.path],
    queryFn: async () => {
      const res = await fetch(api.analyze.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.analyze.list.responses[200].parse(await res.json());
    },
  });
}

export function useSubmitAnalysis() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAnalysis) => {
      // Create a copy of the schema to strip any potential frontend-only fields if necessary
      // But here we use the exact schema input
      const res = await fetch(api.analyze.submit.path, {
        method: api.analyze.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
           const error = api.analyze.submit.responses[400].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Analysis failed. Please try again.");
      }
      return api.analyze.submit.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.analyze.list.path] });
    },
  });
}
