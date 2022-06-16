import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AddOrganism } from 'src/models/organism/add-organism.dto';
import { GetSimpleOrganism } from 'src/models/organism/get-simple-organism.dto';
import { OrganismService } from 'src/services/organism.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './add-organism.component.html',
  styleUrls: ['./add-organism.component.scss'],
})
export class AddOrganismComponent implements OnInit {
  createForm = new FormGroup({
    name: new FormControl(''),
    type: new FormControl(''),
    description: new FormControl(''),
    collectionDate: new FormControl(''),
    collectionLocation: new FormControl(''),
    isolationDate: new FormControl(''),
    originPart: new FormControl(''),
  });

  organismId = 0;
  organisms: GetSimpleOrganism[] = [];
  selectedOrganismId = 0;

  isLoading = false;

  constructor(
    private organismService: OrganismService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.organismService
      .getOrganisms()
      .subscribe((organisms: GetSimpleOrganism[]) => {
        this.organisms = organisms;
        this.isLoading = false;
      });
  }

  onSubmit() {
    let organism = this.createForm.value as AddOrganism;

    organism.originOrganismId = null;

    if (this.selectedOrganismId != 0) {
      organism.originOrganismId = this.selectedOrganismId;
    }

    this.isLoading = true;

    this.organismService.addOrganism(organism).subscribe(
      (res: any) => {
        this.router.navigate(['/organisms']).then(() => {
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

  selectOrigin(e: any) {
    this.selectedOrganismId = e.target.value;
  }
}
