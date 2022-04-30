import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AddContainer } from 'src/models/container/add-container.dto';
import { GetSimpleContainer } from 'src/models/container/get-simple-container.dto';
import { GetSimpleOrganism } from 'src/models/organism/get-simple-organism.dto';
import { GetSimpleResearcher } from 'src/models/researcher/get-simple-researcher.dto';
import { ContainerService } from 'src/services/container.service';
import { OrganismService } from 'src/services/organism.service';
import { ResearcherService } from 'src/services/researcher.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './add-container.component.html',
  styleUrls: ['./add-container.component.scss']
})
export class AddContainerComponent implements OnInit {

  createForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    creationDate: new FormControl(''),
    cultureMedia: new FormControl('')
  });

  organisms: GetSimpleOrganism[] = [];
  containers: GetSimpleContainer[] = [];
  researchers: GetSimpleResearcher[] = [];

  selectedOrganismId = 0;
  selectedContainerId = 0;
  selectedResearcherId = 0;

  isLoading = false;

  constructor(
    private organismService: OrganismService,
    private researcherService: ResearcherService,
    private containerService: ContainerService,
    private router: Router,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.isLoading = true;
    
    this.organismService
      .getOrganisms()
      .subscribe((organisms: GetSimpleOrganism[]) => {
        this.organisms = organisms;
        
        this.researcherService
          .getResearchers()
          .subscribe((researchers: GetSimpleResearcher[]) => {
            this.researchers = researchers;
            
            this.containerService
              .getContainers()
              .subscribe((containers: GetSimpleContainer[]) => {
                this.containers = containers;
                this.isLoading = false;
              }
            );
          }
        );
      }
    );
  }

  onSubmit() {
    let container = this.createForm.value as AddContainer;

    container.organismId = null;
    container.researcherId = null;
    container.subContainerId = null;

    if (this.selectedOrganismId != 0) {
      container.organismId = this.selectedOrganismId;
    }

    if (this.selectedResearcherId != 0) {
      container.researcherId = this.selectedResearcherId;
    }

    if (this.selectedContainerId != 0) {
      container.subContainerId = this.selectedContainerId;
    }

    this.isLoading = true;

    this.containerService.addContainer(container).subscribe(
      (res: any) => {
        this.router.navigate(['/containers']).then(() => {
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

        this.isLoading = false;
      },
      () => this.isLoading = false
    );
  }

  selectOrganism(e: any) {
    this.selectedOrganismId = e.target.value;
  }

  selectResearcher(e: any) {
    this.selectedResearcherId = e.target.value;
  }

  selectContainer(e: any) {
    this.selectedContainerId = e.target.value;
  }
}
