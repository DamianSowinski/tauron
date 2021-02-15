import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../shared/toast/toast.component';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { ToastService } from '../shared/toast/toast.service';
import { HttpClientModule } from '@angular/common/http';
import { SvgComponent } from '../shared/svg/svg.component';
import { SvgDefinitionComponent } from '../shared/svg/svg-definition.component';
import { CardComponent } from '../shared/card/card.component';
import { GraphComponent } from '../shared/graph/graph.component';
import { TippyDirective } from '../shared/directives/tippy.directive';
import { ModalComponent } from '../shared/modal/modal.component';

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
