import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './pages/auth/login/login.page.component';
import { ProductPageComponent } from './pages/shopping/product/product.page.component';
import { ProductsPageComponent } from './pages/shopping/products/products.page.component';

const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: 'products', component: ProductsPageComponent },
    { path: 'products/:id', component: ProductPageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
