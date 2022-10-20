import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IAddContainer } from 'src/models/container/add-container';
import { GetSimpleContainer } from 'src/models/container/get-simple-container.dto';
import { ICreateForm } from 'src/models/form/create-form';
import { QuestionBase } from 'src/models/form/question-base';
import { GetSimpleOrganism } from 'src/models/organism/get-simple-organism.dto';
import { IGetSimpleResearcher } from 'src/models/researcher/get-simple-researcher';
import { ContainerService } from 'src/services/container.service';
import { OrganismService } from 'src/services/organism.service';
import { QuestionService } from 'src/services/question.service';
import { ResearcherService } from 'src/services/researcher.service';

@Component({
  templateUrl: './add-container.component.html',
  styleUrls: ['./add-container.component.scss'],
})
export class AddContainerComponent implements OnInit {
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
      key: 'creationDate',
      label: 'Creation Date',
      type: 'date',
      order: 3,
    },
    {
      key: 'transferDate',
      label: 'Transfer Date',
      type: 'date',
      order: 4,
    },
    {
      key: 'cultureMedia',
      label: 'Culture Media',
      type: 'text',
      order: 5,
    },
    {
      key: 'researcherId',
      label: 'Researcher',
      type: 'dropdown',
      options: [],
      order: 6,
    } as ICreateForm,
    {
      key: 'subContainerId',
      label: 'Sub Container',
      type: 'dropdown',
      required: false,
      options: [],
      order: 7,
    } as ICreateForm,
    {
      key: 'organismId',
      label: 'Organism',
      type: 'dropdown',
      options: [],
      order: 8,
    } as ICreateForm,
  ];

  isLoading = false;

  constructor(
    private organismService: OrganismService,
    private researcherService: ResearcherService,
    private containerService: ContainerService,
    private router: Router,
    private questionService: QuestionService,
    private toastr: ToastrService
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.organismService.getOrganisms().subscribe(
      (organisms: GetSimpleOrganism[]) => {
        this.questionsTypes[7].options = organisms.map((organism) => ({
          key: organism.id!.toString(),
          value: organism.name,
        }));

        this.researcherService.getResearchers().subscribe(
          (researchers: IGetSimpleResearcher[]) => {
            this.questionsTypes[5].options = researchers.map((researcher) => ({
              key: researcher.id!.toString(),
              value: researcher.name,
            }));

            this.containerService.getContainers().subscribe(
              (containers: GetSimpleContainer[]) => {
                this.questionsTypes[6].options = containers.map(
                  (container) => ({
                    key: container.id!.toString(),
                    value: container.name,
                  })
                );
                this.questions = this.questionService.getQuestions(
                  this.questionsTypes
                );
                this.isLoading = false;
              },
              (err: any) => (this.isLoading = false)
            );
          },
          (err: any) => (this.isLoading = false)
        );
      },
      (err: any) => (this.isLoading = false)
    );
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    this.containerService.addContainer(payload as IAddContainer).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/containers']).then(() => {
          this.toastr.success(res.body, 'Success');
        });
      },
      (err: any) => (this.isLoading = false)
    );
  }
}
