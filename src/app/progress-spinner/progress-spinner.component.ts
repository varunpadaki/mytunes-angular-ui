import { Component, OnInit, Input } from '@angular/core';
import { OverlayService } from '../common-utils/overlay.service';
import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent implements OnInit {

  @Input() showSpinner: boolean = false;
  @Input() backdropEnabled: boolean = false;
  overlayService: OverlayService;
  overlayRef: OverlayRef;

  constructor(overlayService: OverlayService) {
    this.overlayService = overlayService;
   }

  ngOnInit(): void {
    this.overlayRef = this.overlayService.open({ hasBackdrop: true }, ProgressSpinnerComponent);
  }

  ngDoCheck() {
    // Based on status of displayProgressSpinner attach/detach overlay to progress spinner template
    if (this.showSpinner && !this.overlayRef.hasAttached()) {
      const componentPortal = new ComponentPortal(ProgressSpinnerComponent);
      this.overlayRef.attach(componentPortal);
    } else if (!this.showSpinner && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
}
}
