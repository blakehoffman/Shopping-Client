import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    isUserLoggedIn = false;

    constructor(private _authService: AuthService) { }

    ngOnInit(): void {
        this._authService.isLoggedInChange
            .subscribe(isLoggedIn => this.isUserLoggedIn = isLoggedIn);
    }

    logout(): void {
        this._authService.logout();
    }
}
