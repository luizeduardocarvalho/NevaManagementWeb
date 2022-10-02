import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICreateForm } from 'src/models/form/create-form';
import { QuestionBase } from 'src/models/form/question-base';
import { IAddLocation } from 'src/models/location/add-location.dto';
import { GetSimpleLocation } from 'src/models/location/get-simple-location.dto';
import { LocationService } from 'src/services/location.service';
import { QuestionService } from 'src/services/question.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})
export class AddLocationComponent implements OnInit {
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
    },
    {
      key: 'sublocationId',
      label: 'Sub Location',
      type: 'dropdown',
      options: [],
      order: 3,
    } as ICreateForm,
  ];

  isLoading = false;

  constructor(
    private locationService: LocationService,
    private router: Router,
    private toastService: ToastService,
    private questionService: QuestionService
  ) {
    this.questions = questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.locationService
      .getLocations()
      .subscribe((locations: GetSimpleLocation[]) => {
        let options = locations.map((location) => ({
          key: location.id?.toString()!,
          value: location.name,
        }));
        this.questionsTypes[2].options = options;
        this.questions = this.questionService.getQuestions(this.questionsTypes);

        this.isLoading = false;
      });
  }

  onSubmit(payload: any): void {
    this.isLoading = true;
    this.locationService.addLocation(payload as IAddLocation).subscribe(
      (res: any) => {
        this.router.navigate(['/locations']).then(() => {
          this.toastService.show(res.body, 'Success', false);
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

          this.toastService.show(message, 'Error', true);
          this.isLoading = false;
        }
      },
      () => (this.isLoading = false)
    );
  }
}
