import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { IChangePassword } from 'src/models/change-password/change-password';
import { QuestionBase } from 'src/models/form/question-base';
import { AuthService } from 'src/services/auth.service';
import { QuestionService } from 'src/services/question.service';

@Component({
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  questions: QuestionBase<any>[];

  questionsTypes = [
    {
      key: 'oldPassword',
      label: 'Old Password',
      type: 'password',
      order: 1,
    },
    {
      key: 'newPassword',
      label: 'New Password',
      type: 'password',
      order: 2,
    },
    {
      key: 'checkNewPassword',
      label: 'Confirm New Password',
      type: 'password',
      order: 3,
    },
  ];

  isLoading = false;

  constructor(
    private questionService: QuestionService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {}

  onSubmit(payload: any) {
    var changePasswordForm = JSON.parse(payload) as IChangePassword;
    changePasswordForm.email = this.authService.getEmail();

    if (changePasswordForm.newPassword === changePasswordForm.oldPassword) {
      this.toastr.error(
        'The old password and the new one cannot be the same.',
        'Error'
      );
    }

    if (
      changePasswordForm.newPassword !== changePasswordForm.checkNewPassword
    ) {
      this.toastr.error(
        'Password confirmation should be the same as the new password.',
        'Error'
      );
    }

    if (
      changePasswordForm.newPassword !== changePasswordForm.oldPassword &&
      changePasswordForm.newPassword === changePasswordForm.checkNewPassword
    ) {
      this.isLoading = true;
      this.authService.changePassword(changePasswordForm).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['/']).then(() => {
            this.toastr.success('Password changed!', 'Success');
          });
        },
        (err: any) => (this.isLoading = false)
      );
    }
  }
}
