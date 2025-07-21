import { supabase } from '@/lib/supabase/client';
import { create } from 'zustand';

type ProjectState = {
  project: (ProjectTable & { crm?: CRMTable }) | null;
  getProject: (username: ProjectTable['username']) => Promise<void>;
  getCRM: (projectId: ProjectTable['id']) => Promise<void>;
  resetProject: () => void;
};

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,

  resetProject: () => set({ project: null }),

  getProject: async (username) => {
    try {
      if (!username) {
        console.log('Username is required to fetch project info.');
        return;
      }

      const { data, error } = await supabase.from('projects').select('*').eq('username', username).single();

      if (error) {
        console.log('Error fetching project info:', error);
        return;
      }

      if (data) {
        set({ project: data });
      }
      return data;
    } catch (error) {
      console.log('Unexpected error:', error);
    }
  },

  getCRM: async (projectId) => {
    const { data, error } = await supabase
      .from('crm')
      .select('id, functions, config, lastSync, lastCommit, created_at')
      .eq('projectId', projectId)
      .single();

    if (data) {
      const current = get().project;
      if (current) {
        set({ project: { ...current, crm: data } });
      }
    } else if (error) {
      console.error('Error fetching CRM info:', error);
    }
  },
}));
