import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUseEquipment } from 'src/models/equipment-usage/use-equipment';
import { QuestionBase } from 'src/models/form/question-base';
import { IUser } from 'src/models/user/user.dto';
import { AuthService } from 'src/services/auth.service';
import { EquipmentUsageService } from 'src/services/equipment-usage.service';
import { QuestionService } from 'src/services/question.service';

@Component({
  selector: 'app-use-equipment',
  templateUrl: './use-equipment.component.html',
  styleUrls: ['./use-equipment.component.scss'],
})
export class UseEquipmentComponent implements OnInit {
  questions: QuestionBase<any>[];

  questionsTypes = [
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      value: '',
      required: false,
      order: 1,
    },
    {
      key: 'startDate',
      label: 'Start Date',
      type: 'date',
      order: 2,
    },
    {
      key: 'endDate',
      label: 'End Date',
      type: 'date',
      order: 3,
    },
  ];

  equipmentId = 0;
  researcher!: IUser;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private questionService: QuestionService,
    private equipmentUsageService: EquipmentUsageService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.equipmentId = params['id'];
    });

    this.researcher = this.authService.getUser();
    console.log(this.researcher);
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    let serializedPayload = JSON.parse(payload) as IUseEquipment;
    serializedPayload.equipmentId = this.equipmentId;
    serializedPayload.researcherId = this.researcher.id;

    this.equipmentUsageService.useEquipment(serializedPayload).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/equipment', this.equipmentId]).then(() => {
          this.toastr.success(res.body, 'Success');
        });
      },
      (err: any) => (this.isLoading = false)
    );
  }
}
