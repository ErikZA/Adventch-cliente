export interface NewProcessViewModel {
  bagPorcentage: number;
  serieId: number;
  schoolId: number;
  userId: number;
  responsible: ResponsibleProcessViewModel;
  student: StudentProcessViewModel;
  documents: number[];
  schoolYear: number;
}

export interface ResponsibleProcessViewModel extends NewResponsibleViewModel {
  id: number;
}

export interface NewResponsibleViewModel {
  cpf: string;
  name: string;
  email: string;
  phone: string;
}

export interface StudentProcessViewModel extends StudentProcessDataViewModel {
  id: number;
}

export interface StudentProcessDataViewModel {
  name: string;
  rc?: number;
}

export interface EditProcessViewModel {
  id: number;
  protocol: string;
  bagPorcentage: number;
  serieId: number;
  documents: number[];
  student: StudentProcessViewModel;
  responsible: ResponsibleProcessViewModel;
  schoolYear: number;
}

export interface ProcessUploadViewModel {
  id: number;
  name: string;
}
