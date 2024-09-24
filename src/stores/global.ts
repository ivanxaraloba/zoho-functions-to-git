import { supabase } from "@/lib/supabase/client";
import { Deparment, Project } from "@/types/types";
import { create } from "zustand";

type GlobalState = {
  projects: Project[];
  getProjects: () => Promise<void>;
  departments: Deparment[];
  getDepartments: () => Promise<void>;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  projects: [],
  getProjects: async () => {
    const { data, error } = await supabase
      .from("projects")
      .select(
        "*, departments(*), crm(*), creator(*, creatorApps(*)), recruit(*)"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects info:", error);
      return;
    }

    if (data) {
      set({ projects: data });
    }
  },
  departments: [],
  getDepartments: async () => {
    const { data, error } = await supabase.from("departments").select("*");

    if (error) {
      console.error("Error fetching departments info:", error);
      return;
    }

    if (data) {
      set({ departments: data });
    }
  },
}));
