import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMitarbeiter } from 'app/shared/model/mitarbeiter.model';
import { MitarbeiterService } from './mitarbeiter.service';

@Component({
  selector: 'jhi-mitarbeiter-delete-dialog',
  templateUrl: './mitarbeiter-delete-dialog.component.html'
})
export class MitarbeiterDeleteDialogComponent {
  mitarbeiter: IMitarbeiter;

  constructor(
    protected mitarbeiterService: MitarbeiterService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.mitarbeiterService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'mitarbeiterListModification',
        content: 'Deleted an mitarbeiter'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-mitarbeiter-delete-popup',
  template: ''
})
export class MitarbeiterDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ mitarbeiter }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(MitarbeiterDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.mitarbeiter = mitarbeiter;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/mitarbeiter', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/mitarbeiter', { outlets: { popup: null } }]);
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
