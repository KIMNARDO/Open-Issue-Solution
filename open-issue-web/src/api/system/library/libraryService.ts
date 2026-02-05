import ServiceBase from 'api/ServiceBase';
import { AssessmentLibrary, CodeLibrary, CodeLibrarySearch, DLibrary, LibrarySearch } from './library.types';

class LibraryService extends ServiceBase {
  private readonly domain: string = '/library';

  // library

  deleteLibrary(payload: DLibrary) {
    return this.service.post(`${this.domain}/delete`, payload);
  }

  insertLibrary(payload: DLibrary) {
    return this.service.post(`${this.domain}/insert`, payload);
  }

  modifyLibrary(payload: DLibrary) {
    return this.service.post(`${this.domain}/modify`, payload);
  }

  objectLibrary() {
    return this.service.post(`${this.domain}/object`);
  }

  selectLibrary(param: LibrarySearch) {
    return this.service.post<DLibrary[]>(`${this.domain}/sel`, param);
  }

  updateLibrary(payload: DLibrary) {
    return this.service.post(`${this.domain}/update`, payload);
  }

  selectSessionLibrary() {
    return this.service.get<Record<string, DLibrary[]>>(`${this.domain}`);
  }
  selectAllLibrary() {
    return this.service.post(`${this.domain}/all`);
  }

  // code library
  selectAllCodeLibrary(param: CodeLibrarySearch) {
    return this.service.post<CodeLibrary[]>(`${this.domain}/code/all`, param);
  }
  selectChildCodeLibrary(param: CodeLibrarySearch) {
    return this.service.post<CodeLibrary[]>(`${this.domain}/code/child`, param);
  }
  selectChildListCodeLibrary(code: string) {
    return this.service.get<CodeLibrary[]>(`${this.domain}/code/child/list/${code}`);
  }
  deleteCodeLibrary(payload: CodeLibrary) {
    return this.service.post(`${this.domain}/code/delete`, payload);
  }
  insertCodeLibrary(payload: CodeLibrary) {
    return this.service.post(`${this.domain}/code/insert`, payload);
  }
  objectCodeLibrary() {
    return this.service.post(`${this.domain}/code/object`);
  }
  selectCodeLibrary(param: CodeLibrarySearch) {
    return this.service.post<CodeLibrary[]>(`${this.domain}/code/sel`, param);
  }
  updateCodeLibrary(payload: CodeLibrary) {
    return this.service.post(`${this.domain}/code/update`, payload);
  }

  // assessment
  selectAssessmentList() {
    return this.service.get<AssessmentLibrary[]>(`${this.domain}/assess/list`);
  }
  updateAssessment(payload: AssessmentLibrary) {
    return this.service.post(`${this.domain}/assess/update`, payload);
  }
}

export default new LibraryService();
