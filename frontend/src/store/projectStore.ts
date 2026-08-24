import { create } from 'zustand';
import type { Project } from '@/types/project.types';

interface ProjectState {
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  activeProject: JSON.parse(localStorage.getItem('activeProject') || 'null'),
  setActiveProject: (project) => {
    if (project) {
      localStorage.setItem('activeProject', JSON.stringify(project));
    } else {
      localStorage.removeItem('activeProject');
    }
    set({ activeProject: project });
  },
}));
