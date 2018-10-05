export interface RequirementEditInterface {
  id: number;
  position: number;
  name: string;
  description: string;
  score: number;
  isAnual: boolean;
  date: Date;
  hasAvaliation: boolean;
}
