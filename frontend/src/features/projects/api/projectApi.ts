import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { Project, CreateGithubProjectRequest, PagedResponse } from '@/types/project.types';

export const projectApi = {
  /** Upload a ZIP file */
  uploadZip: (name: string, description: string, file: File) => {
    const form = new FormData();
    form.append('name', name);
    if (description) form.append('description', description);
    form.append('file', file);
    return api.post<ApiResponse<Project>>('/projects/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /** Connect a GitHub repo */
  connectGithub: (data: CreateGithubProjectRequest) =>
    api.post<ApiResponse<Project>>('/projects/github', data),

  /** List all projects (paginated) */
  listProjects: (page = 0, size = 20) =>
    api.get<ApiResponse<PagedResponse<Project>>>('/projects', { params: { page, size } }),

  /** Get a single project */
  getProject: (id: string) =>
    api.get<ApiResponse<Project>>(`/projects/${id}`),

  /** Delete a project */
  deleteProject: (id: string) =>
    api.delete<ApiResponse<void>>(`/projects/${id}`),
};
