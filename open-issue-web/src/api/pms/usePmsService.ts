import { useQuery } from '@tanstack/react-query';
import { queryOptions } from './pms.query';
import { PmsProjectSearch, ProjectSearch } from './pms.types';

export const useProjectList = (params: ProjectSearch) => useQuery(queryOptions.projects(params));
export const useProjectWBS = (pjtUid: number) => useQuery(queryOptions.projectWBS(pjtUid));
export const useProjectMembers = (pjtUid: number) => useQuery(queryOptions.projectMembers(pjtUid));
export const useProjectTemplateList = (param: PmsProjectSearch) => useQuery(queryOptions.projectTemplates(param));
