import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ItemCatalogComponent } from './components/item-catalog/item-catalog.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialog} from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';

import { NgxStarRatingModule } from 'ngx-star-rating';
import { BarRatingModule } from "ngx-bar-rating";

import {MatSortModule} from '@angular/material/sort'; 

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListsComponent } from './components/lists/lists.component';
import { FollowersComponent } from './components/followers/followers.component';
import { FollowingComponent } from './components/following/following.component';
import { LibraryComponent } from './components/library/library.component';
import { ListDetailComponent } from './components/list-detail/list-detail.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatToolbarModule} from "@angular/material/toolbar";
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CustomListsComponent } from './components/custom-lists/custom-lists.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';

import { ListCreationComponent } from './components/list-creation/list-creation.component';



import {CarrinhoComponent} from "./components/carrinho/carrinho.component";
import { CheckoutComponent } from './components/checkout/checkout.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatRadioModule} from "@angular/material/radio";
import { AvaliacaoDialogComponent } from './components/item-detail/avaliacao-dialog/avaliacao-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UserProfileComponent,
    ItemCatalogComponent,
    ItemDetailComponent,
    WishlistComponent,
    LibraryComponent,
    CustomListsComponent,
    ListsComponent,
    FollowersComponent,
    FollowingComponent,
    ListDetailComponent,
    EditProfileComponent,
    CarrinhoComponent,
    CheckoutComponent,
    ListCreationComponent,
    AvaliacaoDialogComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    NgbModule,
    MatAutocompleteModule,
    MatToolbarModule,
    MatDialogModule,
    MatExpansionModule,
    MatStepperModule,
    MatRadioModule,
    MatSnackBarModule,
    FormsModule,
    MatTableModule,

    NgxStarRatingModule,
    BarRatingModule,
    MatSortModule,
    FlexLayoutModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}

  ],
  bootstrap: [AppComponent],
  //entryComponents : [ListCreationComponent],
  entryComponents: [
    AvaliacaoDialogComponent
  ]
})
export class AppModule { }
