import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast/toast.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ToastService } from './toast/toast.service';
import { HttpClientModule } from '@angular/common/http';
import { SvgComponent } from './svg/svg.component';
import { SvgDefinitionComponent } from './svg/svg-definition.component';
import { CardComponent } from './card/card.component';
import { GraphComponent } from './graph/graph.component';
import { TippyDirective } from './directives/tippy.directive';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    ToastComponent,
    LoadingSpinnerComponent,
    SvgComponent,
    SvgDefinitionComponent,
    CardComponent,
    GraphComponent,
    TippyDirective,
    ModalComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  exports: [
    ToastComponent,
    LoadingSpinnerComponent,
    HttpClientModule,
    SvgComponent,
    SvgDefinitionComponent,
    CardComponent,
    GraphComponent,
    TippyDirective,
    ModalComponent
  ],
  providers: [
    ToastService
  ]
})
export class SharedModule {
}
