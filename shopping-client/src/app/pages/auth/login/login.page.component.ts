import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert/alert.service';
import { LoginDTO } from '../../../dtos/login-dto';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';

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

    constructor(
        private _authService: AuthService,
        private _alertService: AlertService,
        private _cartService: CartService,
        private _router: Router) { }

    get username(): string {
        return this.form.get('username')?.value;
    }

    get password(): string {
        return this.form.get('password')?.value;
    }
    
    ngOnInit(): void {
        
    }

    onSubmit(): void {
        let loginDTO: LoginDTO = {
            username: this.username,
            password: this.password
        };

        this._authService.login(loginDTO)
            .subscribe(result => {  
                this._cartService.getUserCartAndMergeExistingCart().subscribe();
                this._router.navigate(['/products/']);
            });
    }

}