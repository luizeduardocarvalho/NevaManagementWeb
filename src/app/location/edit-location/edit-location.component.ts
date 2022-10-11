import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICreateForm } from 'src/models/form/create-form';
import { QuestionBase } from 'src/models/form/question-base';
import { GetDetailedLocation } from 'src/models/location/get-detailed-location.dto';
import { GetSimpleLocation } from 'src/models/location/get-simple-location.dto';
import { LocationService } from 'src/services/location.service';
import { QuestionService } from 'src/services/question.service';

@Component({
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss'],
})
export class EditLocationComponent implements OnInit {
  questions: QuestionBase<any>[];

  questionsTypes: ICreateForm[] = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      value: '',
      order: 1,
    },
    {
      key: 'subLocationId',
      label: 'Location',
      type: 'dropdown',
      options: [],
      value: '',
      order: 2,
    } as ICreateForm,
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      order: 3,
      value: '',
      required: false,
    },
  ];

  locationId: number = 0;
  isLoading = false;
  isLoadingLocations = false;
  isLoadingLocationById = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private locationService: LocationService,
    private questionService: QuestionService,
    private toastr: ToastrService
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.locationId = params['id'];
    });

    this.isLoadingLocations = true;
    this.isLoadingLocationById = true;

    this.locationService
      .getLocations()
      .subscribe((locations: GetSimpleLocation[]) => {
        this.questionsTypes[1].options = locations.map((location) => ({
          key: location.id!.toString(),
          value: location.name,
        }));
        this.questions = this.questionService.getQuestions(this.questionsTypes);
        this.isLoadingLocations = false;
      });

    this.locationService.getLocationById(this.locationId).subscribe(
      (location: GetDetailedLocation) => {
        this.questionsTypes[0].value = location.name;
        this.questionsTypes[1].value = location.subLocationId.toString();
        this.questionsTypes[2].value = location.description;
        this.questions = this.questionService.getQuestions(this.questionsTypes);
        this.isLoadingLocationById = false;
      },
      (err: any) => (this.isLoading = false)
    );
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    let serializedPayload = JSON.parse(payload);

    let editLocation = {
      id: this.locationId,
      name: serializedPayload.name,
      description: serializedPayload.description,
      subLocationId: serializedPayload.subLocationId,
    };

    this.locationService.editLocation(editLocation).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/locations']).then(() => {
          this.toastr.success(res.body, 'Success');
        });
      },
      (err: any) => (this.isLoading = false)
    );
  }
}
