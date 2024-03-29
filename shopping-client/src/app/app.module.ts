import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductsPageComponent } from './pages/shopping/products/products.page.component';
import { LoginPageComponent } from './pages/auth/login/login.page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './components/alert/alert.component';
import { AuthInterceptor } from './http-interceptors/auth-interceptor';
import { ProductComponent } from './components/product/product.component';
import { ProductPageComponent } from './pages/shopping/product/product.page.component';
import { QuantityStepperComponent } from './components/quantity-stepper/quantity-stepper.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
    declarations: [
        AppComponent,
        ProductsPageComponent,
        LoginPageComponent,
        AlertComponent,
        ProductComponent,
        ProductPageComponent,
        QuantityStepperComponent,
        NavbarComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
