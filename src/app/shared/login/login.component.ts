import { Component, Input, OnInit } from '@angular/core';
import { LoginData, LoginService } from './login.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() isOpen = false;

  isOpenLoginModal: Observable<boolean>;
  form: FormGroup;
  hide = true;
  isLogging = false;

  constructor(private loginService: LoginService, private toast: ToastService) {
    this.isOpenLoginModal = loginService.getModalState();
  }

  ngOnInit(): void {
    this.createForm();
  }

  closeLoginModal() {
    this.loginService.closeLoginModal();
  }

  handleSubmit() {
    const {pointId, username, password} = this.form.value;
    const loginData = {pointId, username, password} as LoginData;
    this.isLogging = true;

    this.toast.clear();
    this.loginService.login(loginData).then(
      () => {
        this.resetForm();
        window.location.reload();
      },
      (errors) => {
        this.toast.error(errors.error.title, errors.error.detail);
        this.resetForm();
      }
    );
  }

  private createForm(): void {
    this.form = new FormGroup({
      pointId: new FormControl('0', {validators: [Validators.required, Validators.minLength(1)]}),
      username: new FormControl('', {validators: [Validators.required, Validators.minLength(3)]}),
      password: new FormControl('', {validators: [Validators.required, Validators.minLength(3)]}),
    });
  }

  private resetForm(): void {
    this.isLogging = false;
    this.form.reset();
    this.createForm();
  }
}
