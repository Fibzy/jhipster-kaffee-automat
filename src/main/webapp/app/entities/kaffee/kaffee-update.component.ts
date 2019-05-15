import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IKaffee, Kaffee } from 'app/shared/model/kaffee.model';
import { KaffeeService } from './kaffee.service';
import { IMitarbeiter } from 'app/shared/model/mitarbeiter.model';
import { MitarbeiterService } from 'app/entities/mitarbeiter';

@Component({
  selector: 'jhi-kaffee-update',
  templateUrl: './kaffee-update.component.html'
})
export class KaffeeUpdateComponent implements OnInit {
  kaffee: IKaffee;
  isSaving: boolean;

  mitarbeiters: IMitarbeiter[];

  editForm = this.fb.group({
    id: [],
    art: [],
    brewTime: [],
    mitarbeiter: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected kaffeeService: KaffeeService,
    protected mitarbeiterService: MitarbeiterService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ kaffee }) => {
      this.updateForm(kaffee);
      this.kaffee = kaffee;
    });
    this.mitarbeiterService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IMitarbeiter[]>) => mayBeOk.ok),
        map((response: HttpResponse<IMitarbeiter[]>) => response.body)
      )
      .subscribe((res: IMitarbeiter[]) => (this.mitarbeiters = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(kaffee: IKaffee) {
    this.editForm.patchValue({
      id: kaffee.id,
      art: kaffee.art,
      brewTime: kaffee.brewTime != null ? kaffee.brewTime.format(DATE_TIME_FORMAT) : null,
      mitarbeiter: kaffee.mitarbeiter
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const kaffee = this.createFromForm();
    if (kaffee.id !== undefined) {
      this.subscribeToSaveResponse(this.kaffeeService.update(kaffee));
    } else {
      this.subscribeToSaveResponse(this.kaffeeService.create(kaffee));
    }
  }

  private createFromForm(): IKaffee {
    const entity = {
      ...new Kaffee(),
      id: this.editForm.get(['id']).value,
      art: this.editForm.get(['art']).value,
      brewTime: this.editForm.get(['brewTime']).value != null ? moment(this.editForm.get(['brewTime']).value, DATE_TIME_FORMAT) : undefined,
      mitarbeiter: this.editForm.get(['mitarbeiter']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKaffee>>) {
    result.subscribe((res: HttpResponse<IKaffee>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackMitarbeiterById(index: number, item: IMitarbeiter) {
    return item.id;
  }
}
