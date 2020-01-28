import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from './material.module';

// Components
import { NavbarComponent } from './navbar/navbar.component';
import { SnackBarComponent } from './snack-bar/snack-bar.component';

// Services
import { SnackBarService } from './snack-bar/snack-bar.service';

@NgModule({
  declarations: [
    NavbarComponent,
    SnackBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  exports: [
    NavbarComponent,
    SnackBarComponent,
    // modules Generics
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [SnackBarComponent],
  providers: [SnackBarService]
})
export class SharedModule { }
