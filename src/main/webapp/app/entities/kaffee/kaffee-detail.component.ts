import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKaffee } from 'app/shared/model/kaffee.model';

@Component({
  selector: 'jhi-kaffee-detail',
  templateUrl: './kaffee-detail.component.html'
})
export class KaffeeDetailComponent implements OnInit {
  kaffee: IKaffee;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ kaffee }) => {
      this.kaffee = kaffee;
    });
  }

  previousState() {
    window.history.back();
  }
}
