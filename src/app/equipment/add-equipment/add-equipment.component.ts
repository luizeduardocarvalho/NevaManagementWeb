import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAddEquipment } from 'src/models/equipment/add-equipment';
import { QuestionBase } from 'src/models/form/question-base';
import { EquipmentService } from 'src/services/equipment.service';
import { QuestionService } from 'src/services/question.service';

@Component({
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.scss'],
})
export class AddEquipmentComponent {
  questions: QuestionBase<any>[];

  questionsTypes = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      order: 1,
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      order: 2,
      required: false,
    },
  ];

  isLoading = false;

  constructor(
    private equipmentService: EquipmentService,
    private router: Router,
    private questionService: QuestionService,
    private toastr: ToastrService
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    this.equipmentService.addEquipment(payload as IAddEquipment).subscribe(
      (res: any) => {
        this.router.navigate(['/equipment']).then(() => {
          this.toastr.success(res.body, 'Success');
        });
      },
      (err: any) => {
        let message = '';
        let errors = err.error.errors;
        if (errors != null) {
          let keys = Object.keys(errors);
          keys.forEach((key: any) => {
            errors[key].forEach((errorMessage: string) => {
              message = errorMessage;
            });
          });

          this.toastr.error(message, 'Error');
          this.isLoading = false;
        }
      },
      () => (this.isLoading = false)
    );
  }
}
