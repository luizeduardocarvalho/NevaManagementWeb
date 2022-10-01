import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ICreateForm } from 'src/models/form/create-form';

import { DateQuestion } from 'src/models/form/date-question';
import { DropdownQuestion } from 'src/models/form/dropdown-question';
import { QuestionBase } from 'src/models/form/question-base';
import { TextQuestion } from 'src/models/form/text-question';
import { TextareaQuestion } from 'src/models/form/textarea-question';

@Injectable()
export class QuestionService {
  getQuestions(createQuestions: ICreateForm[]) {
    let questions: QuestionBase<string>[] = [];

    createQuestions.forEach((question) =>
      questions.push(this.createQuestion(question))
    );

    return of(questions.sort((a, b) => a.order - b.order));
  }

  createQuestion(question: ICreateForm) {
    switch (question.type) {
      case 'text':
        return new TextQuestion({
          key: question.key,
          label: question.label,
          options: [],
          order: question.order,
        });
      case 'textarea':
        return new TextareaQuestion({
          key: question.key,
          label: question.label,
          required: true,
          order: question.order,
        });
      case 'dropdown':
        return new DropdownQuestion({
          key: question.key,
          label: question.label,
          required: true,
          order: question.order,
          options: question.options,
        });
      case 'date':
        return new DateQuestion({
          key: question.key,
          label: question.label,
          required: true,
          order: question.order,
        });
      default:
        return new TextQuestion({
          key: question.key,
          label: question.label,
          options: [],
          order: question.order,
        });
    }
  }
}
