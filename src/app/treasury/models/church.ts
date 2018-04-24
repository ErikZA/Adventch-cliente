import { Unit } from "../../shared/models/unit.model";
import { City } from "../../shared/models/city.model";

export class Church {
  id: string;
  unit: Unit;
  city: City;
  name: string;
  code: string;
  district: string;
  constructor() { }
}
