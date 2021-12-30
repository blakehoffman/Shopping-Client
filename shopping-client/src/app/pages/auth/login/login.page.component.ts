import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
    selector: 'app-login.page',
    templateUrl: './login.page.component.html',
    styleUrls: ['./login.page.component.css']
})
export class LoginPageComponent implements OnInit {

    form = new FormGroup({
        emailAddress: new FormControl('', [Validators.email, Validators.required]),
        password: new FormControl('', Validators.required)
    });

    get emailAddress() {
        return this.form.get('emailAddress');
    }

    get getPassword() {
        return this.form.get('password');
    }

    constructor(private alertService: AlertService) { }

    ngOnInit(): void {

    }

    onSubmit(): void {

    }

}