import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICreateForm } from 'src/models/form/create-form';
import { QuestionBase } from 'src/models/form/question-base';
import { IAddOrganism } from 'src/models/organism/add-organism.dto';
import { GetSimpleOrganism } from 'src/models/organism/get-simple-organism.dto';
import { OrganismService } from 'src/services/organism.service';
import { QuestionService } from 'src/services/question.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './add-organism.component.html',
  styleUrls: ['./add-organism.component.scss'],
})
export class AddOrganismComponent implements OnInit {
  questions: QuestionBase<any>[] = [];

  questionsTypes = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      order: 1,
    },
    {
      key: 'type',
      label: 'Type',
      type: 'text',
      order: 2,
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      order: 3,
    },
    {
      key: 'collectionDate',
      label: 'Collection Date',
      type: 'date',
      order: 4,
    },
    {
      key: 'isolationDate',
      label: 'Isolation Date',
      type: 'date',
      order: 5,
    },
    {
      key: 'originOrganismId',
      label: 'Origin',
      type: 'dropdown',
      order: 6,
      options: [],
    } as ICreateForm,
    {
      key: 'originPart',
      label: 'Origin Part',
      type: 'text',
      order: 7,
    },
  ];

  isLoading = false;

  constructor(
    private organismService: OrganismService,
    private router: Router,
    private toastr: ToastrService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.organismService.getOrganisms().subscribe(
      (organisms: GetSimpleOrganism[]) => {
        this.isLoading = false;
        this.questionsTypes[5].options = organisms.map((organism) => ({
          key: organism.id!.toString(),
          value: organism.name,
        }));
        this.questions = this.questionService.getQuestions(this.questionsTypes);
      },
      (err) => {
        this.toastr.show(err.errorMessage, 'Error');
        this.isLoading = false;
      }
    );
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    this.organismService.addOrganism(payload as IAddOrganism).subscribe(
      (res: any) => {
        this.router.navigate(['/organisms']).then(() => {
          // this.toastService.show(res.body, 'Success', false);
        });
      },
      (err: any) => {
        console.log(err);
        let message = '';
        let errors = err.error.errors;
        if (errors != null) {
          let keys = Object.keys(errors);
          keys.forEach((key: any) => {
            errors[key].forEach((errorMessage: string) => {
              console.log(errorMessage);
              message = errorMessage;
            });
          });

          // this.toastService.show(message, 'Error', true);
          this.isLoading = false;
        }
      },
      () => (this.isLoading = false)
    );
  }
}
