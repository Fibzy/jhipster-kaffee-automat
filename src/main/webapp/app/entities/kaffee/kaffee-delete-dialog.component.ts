import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IKaffee } from 'app/shared/model/kaffee.model';
import { KaffeeService } from './kaffee.service';

@Component({
  selector: 'jhi-kaffee-delete-dialog',
  templateUrl: './kaffee-delete-dialog.component.html'
})
export class KaffeeDeleteDialogComponent {
  kaffee: IKaffee;

  constructor(protected kaffeeService: KaffeeService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.kaffeeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'kaffeeListModification',
        content: 'Deleted an kaffee'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-kaffee-delete-popup',
  template: ''
})
export class KaffeeDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ kaffee }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(KaffeeDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.kaffee = kaffee;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/kaffee', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/kaffee', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
