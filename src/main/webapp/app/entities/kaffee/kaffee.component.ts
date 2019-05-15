import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IKaffee } from 'app/shared/model/kaffee.model';
import { AccountService } from 'app/core';
import { KaffeeService } from './kaffee.service';

@Component({
  selector: 'jhi-kaffee',
  templateUrl: './kaffee.component.html'
})
export class KaffeeComponent implements OnInit, OnDestroy {
  kaffees: IKaffee[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected kaffeeService: KaffeeService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.kaffeeService
      .query()
      .pipe(
        filter((res: HttpResponse<IKaffee[]>) => res.ok),
        map((res: HttpResponse<IKaffee[]>) => res.body)
      )
      .subscribe(
        (res: IKaffee[]) => {
          this.kaffees = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInKaffees();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IKaffee) {
    return item.id;
  }

  registerChangeInKaffees() {
    this.eventSubscriber = this.eventManager.subscribe('kaffeeListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
