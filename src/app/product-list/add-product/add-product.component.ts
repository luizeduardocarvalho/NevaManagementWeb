import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ICreateForm } from 'src/models/form/create-form';
import { QuestionBase } from 'src/models/form/question-base';
import { GetSimpleLocation } from 'src/models/location/get-simple-location.dto';
import { IAddProduct } from 'src/models/product/add-product';
import { LocationService } from 'src/services/location.service';
import { ProductService } from 'src/services/product.service';
import { QuestionService } from 'src/services/question.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  questions: Observable<QuestionBase<any>[]>;

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
      order: 4,
    },
    {
      key: 'sublocationId',
      label: 'Sub Location',
      type: 'dropdown',
      options: [],
      order: 5,
    } as ICreateForm,
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      order: 6,
    },
    {
      key: 'expirationDate',
      label: 'Expiration Date',
      type: 'date',
      order: 7,
    },
  ];

  isLoading = false;

  constructor(
    private productService: ProductService,
    private locationService: LocationService,
    private questionService: QuestionService,
    private toastService: ToastService,
    private router: Router
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

        this.questionsTypes[4].options = options;
      });
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    this.productService.create(payload as IAddProduct).subscribe(
      (res: any) => {
        this.router.navigate(['/products']).then(() => {
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
