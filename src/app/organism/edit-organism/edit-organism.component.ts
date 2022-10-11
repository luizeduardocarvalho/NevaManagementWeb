import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { QuestionBase } from 'src/models/form/question-base';
import { GetDetailedOrganism } from 'src/models/organism/get-detailed-organism.dto';
import { OrganismService } from 'src/services/organism.service';
import { QuestionService } from 'src/services/question.service';

@Component({
  templateUrl: './edit-organism.component.html',
  styleUrls: ['./edit-organism.component.scss'],
})
export class EditOrganismComponent implements OnInit {
  questions: QuestionBase<any>[];

  questionsTypes = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      order: 1,
      value: '',
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      order: 2,
      value: '',
      required: false,
    },
  ];

  organismId = 0;
  isLoading = false;

  constructor(
    private organismService: OrganismService,
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private toastr: ToastrService
  ) {
    this.questions = this.questionService.getQuestions(this.questionsTypes);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.organismId = params['id'];
    });

    this.isLoading = true;

    this.organismService.getOrganismById(this.organismId).subscribe(
      (organism: GetDetailedOrganism) => {
        this.isLoading = false;
        this.questionsTypes[0].value = organism.name;
        this.questionsTypes[1].value = organism.description;
        this.questions = this.questionService.getQuestions(this.questionsTypes);
      },
      (err) => (this.isLoading = false)
    );
  }

  onSubmit(payload: any) {
    this.isLoading = true;

    let parsedPayload = JSON.parse(payload);

    let editOrganism = {
      id: this.organismId,
      name: parsedPayload.name,
      description: parsedPayload.description,
    };

    this.organismService.editOrganism(editOrganism).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/organisms']).then(() => {
          this.toastr.success(res.body, 'Success');
        });
      },
      (err: any) => (this.isLoading = false)
    );
  }
}
