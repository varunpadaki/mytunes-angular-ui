import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';

@Injectable({
    providedIn: 'root'
  })
export class OverlayService {

  constructor(private overlay: Overlay) { }
  open(config: AppOverlayConfig, component: any):OverlayRef {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();
    config['positionStrategy'] = positionStrategy;
    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.overlay.create(config);

    // Create ComponentPortal that can be attached to a PortalHost
    const componentPortal = new ComponentPortal(component);

    // Attach ComponentPortal to PortalHost
    overlayRef.attach(componentPortal);
    return overlayRef;
  }
}
export interface AppOverlayConfig extends OverlayConfig { }