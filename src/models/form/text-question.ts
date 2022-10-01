import { QuestionBase } from './question-base';

export class TextQuestion extends QuestionBase<string> {
  override controlType = 'text';
}