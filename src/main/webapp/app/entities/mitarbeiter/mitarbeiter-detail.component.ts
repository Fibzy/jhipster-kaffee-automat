import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMitarbeiter } from 'app/shared/model/mitarbeiter.model';

@Component({
  selector: 'jhi-mitarbeiter-detail',
  templateUrl: './mitarbeiter-detail.component.html'
})
export class MitarbeiterDetailComponent implements OnInit {
  mitarbeiter: IMitarbeiter;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ mitarbeiter }) => {
      this.mitarbeiter = mitarbeiter;
    });
  }

  previousState() {
    window.history.back();
  }
}
