import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms'
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
 model: any = {};
 @Output() cancelRegister = new EventEmitter(); 
 registerForm: FormGroup;
 bsConfig: Partial<BsDatepickerConfig>;

  constructor(private authService: AuthService,
              private alertify: AlertifyService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'DD/MM/YYYY'
    };
    this.createRegisterForm();
  }
  
  createRegisterForm(){
    this.registerForm = this.fb.group({
       gender: ['male'],
       username: ['',Validators.required],
       knownAs: ['',Validators.required],
       dateOfBirth: [null,Validators.required],
       city: ['',Validators.required],
       country: ['',Validators.required],
       password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
       confirmPassword: ['',Validators.required]
    },{validators: this.passwordMatchValidator});
  }

  passwordMatchValidator(form: FormGroup){
    return form.get('password').value === form.get('confirmPassword').value ? null : {'mismatch':true};
  }

  register(){
   /*  this.authService.register(this.model).subscribe(() => { 
        this.alertify.success("registration successful!"); 
      },
      error=>{
        this.alertify.error(error);
      }); */
      console.log(this.registerForm.value);
  }

  cancel(){
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }
}
