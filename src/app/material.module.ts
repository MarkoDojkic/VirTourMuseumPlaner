import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTreeModule } from "@angular/material/tree";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
    imports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatMenuModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatBadgeModule,
        MatSidenavModule,
        MatGridListModule,
        MatTreeModule,
        MatCardModule,
        MatExpansionModule,
        MatDividerModule,
        MatTabsModule,
        MatTableModule,
        MatSortModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatChipsModule,
        MatAutocompleteModule        
    ],
    exports: [
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatMenuModule,
        MatRadioModule,
        MatCheckboxModule,
        MatSlideToggleModule,
        MatBadgeModule,
        MatSidenavModule,
        MatGridListModule,
        MatTreeModule,
        MatCardModule,
        MatExpansionModule,
        MatDividerModule,
        MatTabsModule,
        MatTableModule,
        MatSortModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatChipsModule,
        MatAutocompleteModule
    ]
})

export class MaterialModule { }