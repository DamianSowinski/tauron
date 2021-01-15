import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast/toast.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ToastService } from './toast/toast.service';
import { HttpClientModule } from '@angular/common/http';
import { SvgComponent } from './svg/svg.component';
import { SvgDefinitionComponent } from './svg/svg-definition.component';

@NgModule({
  declarations: [
    ToastComponent,
    LoadingSpinnerComponent,
    SvgComponent,
    SvgDefinitionComponent,
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
  ],
  providers: [
    ToastService
  ]
})
export class SharedModule {
}
