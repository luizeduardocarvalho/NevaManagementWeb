import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionBase } from 'src/models/form/question-base';

@Injectable()
export class QuestionControlService {
  constructor() {}

  toFormGroup(questions: QuestionBase<string>[]) {
    const group: any = {};

    questions.forEach((question) => {
      group[question.key] = question.required
        ? new FormControl(
            { value: question.value || '', disabled: question.disabled },
            Validators.required
          )
        : new FormControl({
            value: question.value || '',
            disabled: question.disabled,
          });
    });

    return new FormGroup(group);
  }
}
