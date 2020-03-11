export interface RequirementEditInterface {
  id: number;
  position: number;
  name: string;
  description: string;
  score: number;
  evaluationTypeId: number;
  date: Date;
  hasAvaliation: boolean;
}
