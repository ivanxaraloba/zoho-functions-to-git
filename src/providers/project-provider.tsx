'use client';

import { createContext, useContext, useState } from 'react';

type ProjectContextType = {
  project: any;
  updateProject: (updated: Partial<any>) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({
  children,
  project: initialProject,
}: {
  children: React.ReactNode;
  project: any;
}) {
  const [project, setProject] = useState(initialProject);

  const updateProject = (updated: Partial<any>) => {
    setProject((prev: any) => ({ ...prev, ...updated }));
  };

  return (
    <ProjectContext.Provider value={{ project, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used inside a ProjectProvider');
  }
  return context.project;
}

export function useProjectUpdater() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectUpdater must be used inside a ProjectProvider');
  }
  return context.updateProject;
}
