import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPipe } from 'src/pipes/search.pipe';
import { SmallCardComponent } from './small-card/small-card.component';
import { BackArrowComponent } from './back-arrow/back-arrow.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { ToastComponent } from './toast/toast.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormulaAndNameSearchPipe } from 'src/pipes/formula-searcher.pipe';
import { NumberToMonthNamePipe } from 'src/pipes/number-to-month-name.pipe';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

@NgModule({
  declarations: [
    SmallCardComponent,
    BackArrowComponent,
    ToastComponent,
    SearchPipe,
    FormulaAndNameSearchPipe,
    SpinnerComponent,
    NumberToMonthNamePipe,
    NavBarComponent,
    DynamicFormQuestionComponent,
    DynamicFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
  ],
  exports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BackArrowComponent,
    ToastComponent,
    SmallCardComponent,
    SearchPipe,
    FormulaAndNameSearchPipe,
    SpinnerComponent,
    NumberToMonthNamePipe,
    NavBarComponent,
    InfiniteScrollModule,
    DynamicFormQuestionComponent,
    DynamicFormComponent,
  ],
})
export class SharedModule {}
