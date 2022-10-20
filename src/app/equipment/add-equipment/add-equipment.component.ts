import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAddEquipment } from 'src/models/equipment/add-equipment';
import { ICreateForm } from 'src/models/form/create-form';
import { QuestionBase } from 'src/models/form/question-base';
import { GetSimpleLocation } from 'src/models/location/get-simple-location.dto';
import { EquipmentService } from 'src/services/equipment.service';
import { LocationService } from 'src/services/location.service';
import { QuestionService } from 'src/services/question.service';

@Component({
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.scss'],
})
export class AddEquipmentComponent implements OnInit {
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
    {
      key: 'patrimony',
      label: 'Patrimony',
      type: 'text',
      order: 3,
    },
    {
      key: 'locationId',
      label: 'Location',
      type: 'dropdown',
      order: 4,
      options: [],
    } as ICreateForm,
  ];

  isLoading = false;

  constructor(
    private equipmentService: EquipmentService,
    private questionService: QuestionService,
    private locationService: LocationService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }
  ngOnInit(): void {
    this.locationService
      .getLocations()
      .subscribe((locations: GetSimpleLocation[]) => {
        let options = locations.map((location) => ({
          key: location.id?.toString()!,
          value: location.name,
        }));
        console.log(options);
        this.questionsTypes[3].options = options;
        this.questions = this.questionService.getQuestions(this.questionsTypes);
      });
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    this.equipmentService.addEquipment(payload as IAddEquipment).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/equipment']).then(() => {
          this.toastr.success(res.body, 'Success');
        });
      },
      (err: any) => {
        this.isLoading = false;
      }
    );
  }
}
