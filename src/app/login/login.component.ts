import { Component, Input, OnInit } from '@angular/core';
import { LoginService, TauronLogin } from './login.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

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

  constructor(private loginService: LoginService) {
    this.isOpenLoginModal = loginService.getModalState();
  }

  ngOnInit(): void {
    this.createForm();
  }

  closeLoginModal() {
    this.loginService.setModalState(false);
  }

  handleSubmit(formDirective: FormGroupDirective) {
    const {id, username, password} = this.form.value;
    const loginData = {id, username, password} as TauronLogin;

    this.loginService.login(loginData).then(() => {
      this.loginService.setModalState(false);
      this.form.reset();
      formDirective.resetForm();
      window.location.reload();
    });
  }

  private createForm() {
    const id = LoginService.getTauronId();

    this.form = new FormGroup({
      id: new FormControl(id, {validators: [Validators.required, Validators.minLength(1)]}),
      username: new FormControl('', {validators: [Validators.required, Validators.minLength(3)]}),
      password: new FormControl('', {validators: [Validators.required, Validators.minLength(3)]}),
    });
  }
}
