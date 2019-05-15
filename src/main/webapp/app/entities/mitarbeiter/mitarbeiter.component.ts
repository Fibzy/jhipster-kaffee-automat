import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMitarbeiter } from 'app/shared/model/mitarbeiter.model';
import { AccountService } from 'app/core';
import { MitarbeiterService } from './mitarbeiter.service';

@Component({
  selector: 'jhi-mitarbeiter',
  templateUrl: './mitarbeiter.component.html'
})
export class MitarbeiterComponent implements OnInit, OnDestroy {
  mitarbeiters: IMitarbeiter[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected mitarbeiterService: MitarbeiterService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.mitarbeiterService
      .query()
      .pipe(
        filter((res: HttpResponse<IMitarbeiter[]>) => res.ok),
        map((res: HttpResponse<IMitarbeiter[]>) => res.body)
      )
      .subscribe(
        (res: IMitarbeiter[]) => {
          this.mitarbeiters = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInMitarbeiters();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IMitarbeiter) {
    return item.id;
  }

  registerChangeInMitarbeiters() {
    this.eventSubscriber = this.eventManager.subscribe('mitarbeiterListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
