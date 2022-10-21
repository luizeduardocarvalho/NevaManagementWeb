import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGetDetailedEquipment } from 'src/models/equipment/get-detailed-equipment.dto';
import { ICreateForm } from 'src/models/form/create-form';
import { QuestionBase } from 'src/models/form/question-base';
import { ISimpleLocation } from 'src/models/location/get-simple-location.dto';
import { EquipmentService } from 'src/services/equipment.service';
import { LocationService } from 'src/services/location.service';
import { QuestionService } from 'src/services/question.service';

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
    {
      key: 'propertyNumber',
      label: 'Property Number',
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

  equipmentId = 0;
  isLoading = false;

  constructor(
    private equipmentService: EquipmentService,
    private questionService: QuestionService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.equipmentId = params['id'];
    });

    this.isLoading = true;

    this.locationService
      .getLocations()
      .subscribe((locations: ISimpleLocation[]) => {
        let options = locations.map((location) => ({
          key: location.id?.toString()!,
          value: location.name,
        }));
        console.log(options);
        this.questionsTypes[3].options = options;
        this.questions = this.questionService.getQuestions(this.questionsTypes);
      });

    this.equipmentService
      .getDetailedEquipment(this.equipmentId)
      .subscribe((equipment: IGetDetailedEquipment) => {
        this.questionsTypes[0].value = equipment.name;
        this.questionsTypes[1].value = equipment.description;
        this.questionsTypes[2].value = equipment.propertyNumber;
        this.questionsTypes[3].value = equipment.location.id!.toString();
        this.questions = this.questionService.getQuestions(this.questionsTypes);
        this.isLoading = false;
      });
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    let serializedPayload = JSON.parse(payload);
    serializedPayload.id = this.equipmentId;

    this.equipmentService.editEquipment(serializedPayload).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/equipment']).then(() => {
          this.toastr.success(res.body, 'Success');
        });
      },
      (err: any) => (this.isLoading = false)
    );
  }
}
