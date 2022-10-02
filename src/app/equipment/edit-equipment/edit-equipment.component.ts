import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IEditEquipment } from 'src/models/equipment/edit-equipment';
import { GetDetailedEquipmentDto } from 'src/models/equipment/get-detailed-equipment.dto';
import { QuestionBase } from 'src/models/form/question-base';
import { EquipmentService } from 'src/services/equipment.service';
import { QuestionService } from 'src/services/question.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './edit-equipment.component.html',
  styleUrls: ['./edit-equipment.component.scss'],
})
export class EditEquipmentComponent implements OnInit {
  questions: QuestionBase<any>[];

  questionsTypes = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      value: '',
      order: 1,
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      value: '',
      order: 2,
      required: false,
    },
  ];

  equipmentId = 0;
  isLoading = false;

  constructor(
    private equipmentService: EquipmentService,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private toastr: ToastrService
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.equipmentId = params['id'];
    });

    this.isLoading = true;

    this.equipmentService
      .getDetailedEquipment(this.equipmentId)
      .subscribe((equipment: GetDetailedEquipmentDto) => {
        this.questionsTypes[0].value = equipment.name;
        this.questionsTypes[1].value = equipment.description;
        this.questions = this.questionService.getQuestions(this.questionsTypes);
        this.isLoading = false;
      });
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    let serializedPayload = JSON.parse(payload);

    let equipment = {
      id: this.equipmentId,
      name: serializedPayload.name,
      description: serializedPayload.description,
    } as IEditEquipment;

    this.equipmentService.editEquipment(equipment).subscribe(
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

          this.toastr.success(message, 'Error');
          this.isLoading = false;
        }
      },
      () => (this.isLoading = false)
    );
  }
}
