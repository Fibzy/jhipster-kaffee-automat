import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IMitarbeiter, Mitarbeiter } from 'app/shared/model/mitarbeiter.model';
import { MitarbeiterService } from './mitarbeiter.service';

@Component({
  selector: 'jhi-mitarbeiter-update',
  templateUrl: './mitarbeiter-update.component.html'
})
export class MitarbeiterUpdateComponent implements OnInit {
  mitarbeiter: IMitarbeiter;
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    vorname: [],
    nachname: []
  });

  constructor(protected mitarbeiterService: MitarbeiterService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ mitarbeiter }) => {
      this.updateForm(mitarbeiter);
      this.mitarbeiter = mitarbeiter;
    });
  }

  updateForm(mitarbeiter: IMitarbeiter) {
    this.editForm.patchValue({
      id: mitarbeiter.id,
      vorname: mitarbeiter.vorname,
      nachname: mitarbeiter.nachname
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const mitarbeiter = this.createFromForm();
    if (mitarbeiter.id !== undefined) {
      this.subscribeToSaveResponse(this.mitarbeiterService.update(mitarbeiter));
    } else {
      this.subscribeToSaveResponse(this.mitarbeiterService.create(mitarbeiter));
    }
  }

  private createFromForm(): IMitarbeiter {
    const entity = {
      ...new Mitarbeiter(),
      id: this.editForm.get(['id']).value,
      vorname: this.editForm.get(['vorname']).value,
      nachname: this.editForm.get(['nachname']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMitarbeiter>>) {
    result.subscribe((res: HttpResponse<IMitarbeiter>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
