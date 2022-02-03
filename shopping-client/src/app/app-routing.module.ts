import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './pages/auth/login/login.page.component';
import { ProductsPageComponent } from './pages/shopping/products/products.page/products.page.component';

const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'products', component: ProductsPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
