import { Injectable } from '@angular/core';

import { ICreateForm } from 'src/models/form/create-form';
import { DateQuestion } from 'src/models/form/date-question';
import { DropdownQuestion } from 'src/models/form/dropdown-question';
import { PasswordQuestion } from 'src/models/form/password-question';
import { QuestionBase } from 'src/models/form/question-base';
import { TextQuestion } from 'src/models/form/text-question';
import { TextareaQuestion } from 'src/models/form/textarea-question';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  getQuestions(createQuestions: ICreateForm[]) {
    let questions: QuestionBase<string>[] = [];

    createQuestions.forEach((question) =>
      questions.push(this.createQuestion(question))
    );

    return questions.sort((a, b) => a.order - b.order);
  }

  createQuestion(question: ICreateForm) {
    switch (question.type) {
      case 'text':
        return new TextQuestion({
          key: question.key,
          label: question.label,
          options: [],
          required: question.required === undefined ? true : question.required,
          order: question.order,
          value: question.value,
        });
      case 'textarea':
        return new TextareaQuestion({
          key: question.key,
          label: question.label,
          required: question.required === undefined ? true : question.required,
          order: question.order,
          value: question.value,
        });
      case 'dropdown':
        return new DropdownQuestion({
          key: question.key,
          label: question.label,
          required: question.required === undefined ? true : question.required,
          order: question.order,
          options: question.options,
          value: question.value,
        });
      case 'date':
        return new DateQuestion({
          key: question.key,
          label: question.label,
          required: question.required === undefined ? true : question.required,
          order: question.order,
          value: question.value,
        });
      case 'password':
        return new PasswordQuestion({
          key: question.key,
          label: question.label,
          required: question.required === undefined ? true : question.required,
          order: question.order,
          value: question.value,
        });
      default:
        return new TextQuestion({
          key: question.key,
          label: question.label,
          options: [],
          required: question.required === undefined ? true : question.required,
          order: question.order,
          value: question.value,
        });
    }
  }
}
