import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { QuestionBase } from 'src/models/form/question-base';
import { QuestionControlService } from 'src/services/question-control.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [QuestionControlService],
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() questions: QuestionBase<string>[] | null = [];
  @Output() formEvent = new EventEmitter<string>();
  form!: FormGroup;
  payLoad = '';

  constructor(private questionControlService: QuestionControlService) {}

  ngOnChanges(): void {
    this.form = this.questionControlService.toFormGroup(
      this.questions as QuestionBase<string>[]
    );
  }

  ngOnInit() {
    this.form = this.questionControlService.toFormGroup(
      this.questions as QuestionBase<string>[]
    );
  }



  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
    this.formEvent.emit(this.payLoad);
  }
}
