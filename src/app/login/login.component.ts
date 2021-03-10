import { Component, Input, OnInit } from '@angular/core';
import { LoginData, LoginService } from './login.service';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(private loginService: LoginService) {
    this.isOpenLoginModal = loginService.getModalState();
  }

  ngOnInit(): void {
    this.createForm();
  }

  closeLoginModal() {
    this.loginService.closeLoginModal();
  }

  handleSubmit() {
    const {id, username, password} = this.form.value;
    const loginData = {id, username, password} as LoginData;
    this.isLogging = true;

    this.loginService.login(loginData).then(
      () => {
        this.isLogging = false;
        this.form.reset();
        window.location.reload();
      },
      (errors) => console.log(`%c ⚠ Warning: ${errors.errors}`, `color: orange; font-weight: bold;`)
    );
  }

  private createForm() {
    const id = LoginService.getPointId();

    this.form = new FormGroup({
      id: new FormControl(id, {validators: [Validators.required, Validators.minLength(1)]}),
      username: new FormControl('', {validators: [Validators.required, Validators.minLength(3)]}),
      password: new FormControl('', {validators: [Validators.required, Validators.minLength(3)]}),
    });
  }
}
