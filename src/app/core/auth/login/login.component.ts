import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('login') loginOption: ElementRef;
  @ViewChild('signup') signupOption: ElementRef;

  loginForm: FormGroup;
  registerForm: FormGroup;
  loginBtn: any;
  signupBtn: any;
  showOr: {
    login: boolean,
    signUp: boolean
  };

  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(Router) private router: Router,
    @Inject(AlertController) private alertCtrl: AlertController,
    @Inject(AuthService) private authService: AuthService,
    @Inject(LoadingController) private loadingController: LoadingController,
    @Inject(FormBuilder) private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      loginEmail: ['admin@email.com', { updateOn: 'blur', validators: [Validators.email, Validators.required] }],
      loginPassword: ['admin', { updateOn: 'change', validators: [Validators.required] }]
    });

    this.registerForm = this.formBuilder.group({
      registerEmail: ['admin@email.com', { updateOn: 'blur', validators: [Validators.email, Validators.required] }],
      registerPassword: ['admin', { updateOn: 'change', validators: [Validators.required] }]
    });
  }

  get loginEmail() {
    return this.loginForm.get('loginEmail');
  }

  get loginPassword() {
    return this.loginForm.get('loginPassword');
  }

  get registerEmail() {
    return this.registerForm.get('registerEmail');
  }

  get registerPassword() {
    return this.registerForm.get('registerPassword');
  }

  ngOnInit(): void {
    this.showOr = { login: false, signUp: true };
  }

  selectLogin(event: any) {
    this.showOr = { login: false, signUp: true };
    const parent = event.target.parentNode;
    Array.from(event.target.parentNode.classList).forEach(element => {
      if (element === 'slide-up') {
        this.signupOption.nativeElement.parentNode.parentNode.classList.add('slide-up');
        parent.classList.remove('slide-up');
      }
    });
  }

  selectSignUp(event: any) {
    this.showOr = { login: true, signUp: false };
    const parent = event.target.parentNode.parentNode;
    Array.from(event.target.parentNode.parentNode.classList).forEach(element => {
      if (element === 'slide-up') {
        this.loginOption.nativeElement.parentNode.classList.add('slide-up');
        parent.classList.remove('slide-up');
      }
    });
  }

  async onLogin() {
    if (!this.loginEmail?.value || !this.loginPassword?.value) {
      return;
    }

    const returnUrl = this.route.snapshot.queryParams.returnUrl || '-/home';
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.loginEmail?.value, this.loginPassword?.value).pipe(take(1)).subscribe(() => {
      this.router.navigateByUrl(returnUrl, { replaceUrl: true });
      loading.dismiss();
    }, async () => {
      const alert = await this.alertCtrl.create({
        header: 'Some of the data entered is invalid',
        message: 'Check the data entered and try again',
        buttons: ['OK']
      });
      await alert.present();
      loading.dismiss();
    });
  }

  async onRegister() {
    if (!this.registerEmail?.value || !this.registerPassword?.value) {
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.register(this.registerEmail?.value, this.registerPassword?.value).pipe(take(1)).subscribe(() => {
      this.router.navigateByUrl('-/home', { replaceUrl: true });
      loading.dismiss();
    });
  }
}
