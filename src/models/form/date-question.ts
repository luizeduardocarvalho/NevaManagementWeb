import { QuestionBase } from './question-base';

export class DateQuestion extends QuestionBase<string> {
  override controlType = 'date';
}