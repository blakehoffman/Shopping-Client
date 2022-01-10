import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert/alert.service';
import { LoginDTO } from '../../../dtos/login-dto';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    selector: 'app-login.page',
    templateUrl: './login.page.component.html',
    styleUrls: ['./login.page.component.css']
})
export class LoginPageComponent implements OnInit {

    form = new FormGroup({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', Validators.required)
    });

    get username(): string {
        return this.form.get('username')?.value;
    }

    get password(): string {
        return this.form.get('password')?.value;
    }

    constructor(
        private authService: AuthService,
        private alertService: AlertService) { }

    ngOnInit(): void {
        
    }

    onSubmit(): void {
        let isSuccessfulLogin = false;
        let loginDTO: LoginDTO = {
            username: this.username,
            password: this.password
        };

        this.authService.login(loginDTO)
            .subscribe(result => isSuccessfulLogin = true);
    }

}