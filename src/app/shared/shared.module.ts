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
import { SidenavComponent } from './sidenav/sidenav.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from './form-field/form-field.component';
import { AriaCurrentDirective } from './directives/aria-current.directive';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    ToastComponent,
    LoadingSpinnerComponent,
    SvgComponent,
    SvgDefinitionComponent,
    CardComponent,
    GraphComponent,
    TippyDirective,
    ModalComponent,
    SidenavComponent,
    LoginComponent,
    FormFieldComponent,
    AriaCurrentDirective,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
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
    ModalComponent,
    SidenavComponent,
    LoginComponent,
    FormFieldComponent,
  ],
  providers: [
    ToastService
  ]
})
export class SharedModule {
}
