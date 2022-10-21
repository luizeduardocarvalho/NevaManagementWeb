import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICreateForm } from 'src/models/form/create-form';
import { QuestionBase } from 'src/models/form/question-base';
import { ISimpleLocation } from 'src/models/location/get-simple-location.dto';
import { LocationService } from 'src/services/location.service';
import { ProductService } from 'src/services/product.service';
import { QuestionService } from 'src/services/question.service';

@Component({
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  questions: QuestionBase<any>[];

  questionsTypes = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      order: 1,
    },
    {
      key: 'quantity',
      label: 'Quantity',
      type: 'text',
      order: 2,
    },
    {
      key: 'unit',
      label: 'Unit',
      type: 'text',
      order: 3,
    },
    {
      key: 'formula',
      label: 'Formula',
      type: 'text',
      required: false,
      order: 4,
    },
    {
      key: 'locationId',
      label: 'Location',
      type: 'dropdown',
      options: [],
      order: 5,
    } as ICreateForm,
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      order: 6,
    },
    {
      key: 'expirationDate',
      label: 'Expiration Date',
      type: 'date',
      required: false,
      order: 7,
    },
  ];

  isLoading = false;

  constructor(
    private productService: ProductService,
    private locationService: LocationService,
    private questionService: QuestionService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {
    this.locationService
      .getLocations()
      .subscribe((locations: ISimpleLocation[]) => {
        let options = locations.map((location) => ({
          key: location.id?.toString()!,
          value: location.name,
        }));

        this.questionsTypes[4].options = options;
        this.questions = this.questionService.getQuestions(this.questionsTypes);
      });
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    this.productService.create(JSON.parse(payload)).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/products']).then(() => {
          this.toastr.success(res, 'Success');
        });
      },
      (err: any) => (this.isLoading = false)
    );
  }
}
