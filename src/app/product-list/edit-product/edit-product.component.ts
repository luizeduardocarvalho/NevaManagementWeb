import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICreateForm } from 'src/models/form/create-form';
import { QuestionBase } from 'src/models/form/question-base';
import { GetSimpleLocation } from 'src/models/location/get-simple-location.dto';
import { IEditProduct } from 'src/models/product/edit-product.dto';
import { IGetDetailedProduct } from 'src/models/product/get-detailed-product.dto';
import { LocationService } from 'src/services/location.service';
import { ProductService } from 'src/services/product.service';
import { QuestionService } from 'src/services/question.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  editForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    location: new FormControl(),
    formula: new FormControl(null),
    expirationDate: new FormControl(),
  });

  questions: QuestionBase<any>[];

  questionsTypes = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      order: 1,
    },
    {
      key: 'formula',
      label: 'Formula',
      type: 'text',
      order: 2,
      required: false,
    },
    {
      key: 'locationId',
      label: 'Location',
      type: 'dropdown',
      options: [],
      order: 3,
    } as ICreateForm,
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      order: 4,
      required: false,
    },
    // {
    //   key: 'expirationDate',
    //   label: 'Expiration Date',
    //   type: 'date',
    //   order: 5,
    // },
  ];

  productId = 0;
  isLoading = false;

  constructor(
    private productService: ProductService,
    private locationService: LocationService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private router: Router
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.route.params.subscribe((params) => {
      this.productId = params['id'];
    });

    this.locationService
      .getLocations()
      .subscribe((locations: GetSimpleLocation[]) => {
        this.questionsTypes[2].options = locations.map((location) => ({
          key: location.id!.toString(),
          value: location.name,
        }));

        this.productService
          .getDetailedProductById(this.productId)
          .subscribe((product: IGetDetailedProduct) => {
            this.questionsTypes[0].value = product.name;
            this.questionsTypes[1].value = product.formula;
            this.questionsTypes[2].value = product.location.id.toString();
            this.questionsTypes[3].value = product.description;
            this.questions = this.questionService.getQuestions(
              this.questionsTypes
            );

            this.isLoading = false;
          });
      });
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    this.productService.editProduct(payload as IEditProduct).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/products', this.productId]).then(() => {
          this.toastr.success(res.body, 'Success');
        });
      },
      (err: any) => (this.isLoading = false)
    );
  }
}
