import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RequirementDataInterface } from '../../interfaces/requirement/requirement-data-interface';
import { RequirementEditInterface } from '../../interfaces/requirement/requirement-edit-interface';
import { RequirementNewInterface } from '../../interfaces/requirement/requirement-new-interface';
import { RequirementUpdateInterface } from '../../interfaces/requirement/requirement-update-interface';
import { RequirementAvaliationChurchInterface } from '../../interfaces/requirement/requirement-avaliation-church-interface';

@Injectable({
  providedIn: 'root'
})
export class RequirementsService {
  protected baseURl = '/treasury/requirement/';

  constructor(
    private http: HttpClient
  ) { }

  public getRequirements(unitId: number): Observable<RequirementDataInterface[]> {
    const url = `${this.baseURl}unit/${unitId}`;
    return this.http
      .get<RequirementDataInterface[]>(url);
  }

  public getRequirementEdit(requirementId: number): Observable<RequirementEditInterface> {
    const url = `${this.baseURl}${requirementId}`;
    return this.http
      .get<RequirementEditInterface>(url);
  }

  public deleteRequirement(requirementId: number): Observable<boolean> {
    const url = `${this.baseURl}${requirementId}`;
    return this.http
      .delete<boolean>(url);
  }

  public postRequirement(requirement: RequirementNewInterface): Observable<boolean> {
    return this.http
      .post<boolean>(this.baseURl, requirement);
  }
  public putRequirement(requirementId: number, requirement: RequirementUpdateInterface): Observable<boolean> {
    const url = `${this.baseURl}${requirementId}`;
    return this.http
      .put<boolean>(url, requirement);
  }

  public getRequirementsByUnitYearly(unitId: number, year: number): Observable<RequirementAvaliationChurchInterface[]> {
    const url = `${this.baseURl}unit/${unitId}/yearly/${year}`;
    return this.http
      .get<RequirementAvaliationChurchInterface[]>(url);
  }

  public getRequirementsByUnitMonthly(unitId: number, year: number): Observable<RequirementAvaliationChurchInterface[]> {
    const url = `${this.baseURl}unit/${unitId}/monthly/year/${year}`;
    return this.http
      .get<RequirementAvaliationChurchInterface[]>(url);
  }
}
