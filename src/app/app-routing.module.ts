import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListsComponent } from './components/lists/lists.component';
import { ListDetailComponent } from './components/list-detail/list-detail.component';
import {ItemDetailComponent} from "./components/item-detail/item-detail.component";
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LibraryComponent } from './components/library/library.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CustomListsComponent } from './components/custom-lists/custom-lists.component';
import { FollowersComponent } from './components/followers/followers.component';
import { FollowingComponent } from './components/following/following.component';
import {CarrinhoComponent} from "./components/carrinho/carrinho.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";

export const canActivate = (authGuard:AuthGuard = inject(AuthGuard)) => authGuard.canActivate();
export const canActivateLogin = (authGuard:AuthGuard = inject(AuthGuard)) => authGuard.canActivateLogin();

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent, canActivate:[() => canActivateLogin()]},
  { path: 'dashboard', component: DashboardComponent, canActivate:[() => canActivate()] },
  { path: 'user-profile', component: UserProfileComponent, canActivate:[() => canActivate()] },

  { path: 'wishlist', component: WishlistComponent, canActivate: [() => canActivate()]},
  { path: 'custom-lists', component: CustomListsComponent, canActivate: [() => canActivate()] },

  {path: 'carrinho', component: CarrinhoComponent, canActivate : [() => canActivate()] },

  {path: 'carrinho/checkout', component: CheckoutComponent, canActivate : [() => canActivate()] },


  { path: 'dashboard', component: DashboardComponent, canActivate:[() => canActivate()], children:[
      { path: 'lists', component:ListsComponent, canActivate:[() => canActivate()], children: [
          {path: ':id', component: ListDetailComponent, canActivate:[()=>canActivate()]}]},
      { path: 'following', component:FollowingComponent, canActivate:[() => canActivate()]},
      { path: 'followers', component:FollowersComponent, canActivate:[() => canActivate()]},
      {path: 'library', component:LibraryComponent, canActivate:[()=> canActivate()]}
    ]},

  {path: 'items/:searchItem', component: ItemDetailComponent, canActivate:[() => canActivate()]},
  {path: 'notfound', component: ItemDetailComponent, canActivate:[() => canActivate()]},
  {path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
