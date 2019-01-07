export interface BudgetDataInterface {
  id: number;
  entityCode: string;
  departmentName: string;
  departmentCode: string;
  departmentResponsibles: string;
  previous: number;
  incoming: number;
  outflows: number;
  realized: number;
  avaliable: number;
  description: string;
  value: number;
  year: number;
}
