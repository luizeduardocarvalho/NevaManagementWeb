import { QuestionBase } from './question-base';

export class PasswordQuestion extends QuestionBase<string> {
  override controlType = 'password';
}
