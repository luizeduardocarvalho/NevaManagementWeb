import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditOrganism } from 'src/models/organism/edit-organism.dto';
import { GetDetailedOrganism } from 'src/models/organism/get-detailed-organism.dto';
import { OrganismService } from 'src/services/organism.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './edit-organism.component.html',
  styleUrls: ['./edit-organism.component.scss']
})
export class EditOrganismComponent implements OnInit {

  editForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('')
  });

  organismId = 0;
  isLoading = false;

  constructor(
    private organismService: OrganismService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.organismId = params['id'];
    });

    this.isLoading = true;

    this.organismService
      .getOrganismById(this.organismId)
      .subscribe((organism: GetDetailedOrganism) => {
        this.editForm = new FormGroup({
          name: new FormControl(organism.name),
          description: new FormControl(organism.description)
        });
        this.isLoading = false;
      });
  }

  onSubmit() {
    let organism = this.editForm.value as EditOrganism;
    organism.id = this.organismId;

    this.isLoading = true;

    this.organismService.editOrganism(organism).subscribe(
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
            })
          });

          this.toastService.show(message, 'Error', true);
        }
      },
      () => this.isLoading = false
    );
  }
}
