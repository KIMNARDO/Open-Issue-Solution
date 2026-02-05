import { PmsProjectSearch, ProjectSearch } from './pms.types';
import PmsService from './PmsService';

type queryKeyNames =
  | 'projects'
  | 'projectWBS'
  | 'projectMembers'
  | 'projectDetail'
  | 'projectOemCarData'
  | 'projectTemplates'
  | 'projectTemplateDetail';

export const queryKeys: Record<queryKeyNames, any> = {
  projects: (pjtSearch: ProjectSearch) => ['projects', pjtSearch] as const,
  projectWBS: (pjtUid: number) => ['projectWBS', pjtUid] as const,
  projectMembers: (pjtUid: number) => ['projectMembers', pjtUid] as const,
  projectDetail: (oid: number) => ['projectDetail', oid] as const,
  projectTemplateDetail: (oid: number) => ['project', 'template', 'detail', oid] as const,
  projectOemCarData: () => ['projectOemCarData'] as const,
  projectTemplates: (param: PmsProjectSearch) => ['project', 'templates', param] as const
};

export const queryOptions = {
  projects: (pjtSearch: ProjectSearch) => ({
    queryKey: queryKeys.projects(pjtSearch),
    queryFn: () => PmsService.getProjects(pjtSearch)
  }),
  projectDetail: (oid: number) => ({
    queryKey: queryKeys.projectDetail(oid),
    queryFn: () => PmsService.getProjectDetail(oid)
  }),
  projectTemplateDetail: (oid: number) => ({
    queryKey: queryKeys.projectTemplateDetail(oid),
    queryFn: () => PmsService.getProjectTemplateDetail(oid)
  }),
  projectWBS: (pjtUid: number) => ({
    queryKey: queryKeys.projectWBS(pjtUid),
    queryFn: () => PmsService.getProjectWBS(pjtUid),
    enabled: !!pjtUid && pjtUid > 0
  }),
  projectMembers: (pjtUid: number) => ({
    queryKey: queryKeys.projectMembers(pjtUid),
    queryFn: () => PmsService.getProjectMembers(pjtUid),
    enabled: !!pjtUid && pjtUid > 0
  }),
  projectOemCarData: () => ({
    queryKey: queryKeys.projectOemCarData(),
    queryFn: () => PmsService.getProjectOemCarData()
  }),
  projectTemplates: (param: PmsProjectSearch) => ({
    queryKey: queryKeys.projectTemplates(param),
    queryFn: () => PmsService.getProjectTemplates(param)
  })
};
