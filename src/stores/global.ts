import { supabase } from '@/lib/supabase/client';
import { IProjectWithRelations } from '@/types/fixed-types';
import { Deparment, Project, User } from '@/types/types';
import { create } from 'zustand';

type GlobalState = {
  user: User | null;
  getUser: () => Promise<any>;
  projects: IProjectWithRelations[];
  getProjects: () => Promise<any>;
  departments: Deparment[];
  getDepartments: () => Promise<void>;
  functions: any[];
  getFunctions: () => Promise<void>;
};

export const useGlobalStore = create<GlobalState>((set) => ({
  user: null,
  getUser: async () => {

    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    console.log({ supabaseUser });

    if (!supabaseUser) return null;

    const { data: userProfile } = await supabase
      .from('users')
      .select()
      .eq('id', supabaseUser.id)
      .single();

    if (!userProfile) {
      set({ user: { ...supabaseUser, profile: null } });
      return { ...supabaseUser, profile: null };
    }

    set({ user: { ...supabaseUser, profile: userProfile } });
    return { ...supabaseUser, profile: userProfile };
  },
  projects: [],
  getProjects: async () => {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select(
          '*, departments(*), crm(id), creator(id, creatorApps(id)), recruit(id)',
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ projects: projects });
    } catch (error) {
      console.error(
        'Unexpected error while fetching projects:',
        error,
      );
    }
  },

  departments: [],
  getDepartments: async () => {
    const { data, error } = await supabase
      .from('departments')
      .select('*');

    if (error) {
      console.error('Error fetching departments info:', error);
      return;
    }

    if (data) {
      set({ departments: data });
    }
  },

  functions: [],
  getFunctions: async () => {
    const { data, error } = await supabase
      .from('functions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching functions info:', error);
      return;
    }

    if (data) set({ functions: data });
  },
}));
