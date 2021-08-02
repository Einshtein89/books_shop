import {ComponentFactoryResolver, ComponentRef, Injectable} from '@angular/core';
import {ViewContainerRef} from "@angular/core/src/linker/view_container_ref";

@Injectable()
export class ComponentFactory {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  getComponent(component: any, containerRef: ViewContainerRef): ComponentRef<any> {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    containerRef.clear();
    return containerRef.createComponent(factory);
  }
}
