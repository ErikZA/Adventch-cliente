import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { skipWhile, switchMap, tap } from 'rxjs/operators';
import { ObservationService } from '../../../observation/observation.service';
import { Observable, Subscription } from 'rxjs';
import { ObservationAvaliationFormInterface } from '../../../../interfaces/observation/observation-avaliation-form-interface';
import { ConfirmDialogService } from '../../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-observations-information',
  templateUrl: './observations-information.component.html',
  styleUrls: ['./observations-information.component.scss']
})
@AutoUnsubscribe()
export class ObservationsInformationComponent implements OnInit, OnDestroy {

  subObservations: Subscription;
  subsConfirmFinalize: Subscription;
  expanded = false;
  observations: ObservationAvaliationFormInterface[];
  alreadySearched = false;

  constructor(
    private route: ActivatedRoute,
    private observationService: ObservationService,
    private confirmDialogService: ConfirmDialogService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }

  public expandedObservations(): void {
    this.expanded = !this.expanded;
    if (!this.alreadySearched) {
      this.subObservations = this.getData()
        .subscribe();
    }
  }

  private getData() {
    this.alreadySearched = true;
    return this.route.params
      .pipe(
        skipWhile(({ id }) => !id),
        skipWhile(({ year }) => !year),
        switchMap(({ id, year }) => this.getObservationsChurch(id, year))
      );
  }

  public getObservationsChurch(churchId, year): Observable<ObservationAvaliationFormInterface[]> {
    return this.observationService
      .getObservationsAvaliationByChurchIdAndYear(churchId, year)
      .pipe(
        skipWhile((data: ObservationAvaliationFormInterface[]) => !data),
        tap((data: ObservationAvaliationFormInterface[]) => this.observations = data)
      );
  }

  private finalizeObsevation(observationId: number): void {
    this.subsConfirmFinalize = this.confirmDialogService
      .confirm('Finalizar observação', 'Você deseja realmente finalizar a observação?', 'FINALIZAR')
      .pipe(
        skipWhile(res => res !== true),
        switchMap(() => this.sendFinalize(observationId))
      ).subscribe();
  }


  private sendFinalize(observationId: number): Observable<any> {
    return this.observationService
      .finalizeObservation({ id: observationId })
      .pipe(
        switchMap(() => this.getData()),
        tap(() => this.snackBar.open('Observação finalizada com sucesso!', 'OK', { duration: 3000 }),
          () => this.snackBar.open('Ocorreu um erro ao finalizar a observação', 'OK', { duration: 3000 }))
      );
  }
}
