import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EditEquipmentDto } from 'src/models/equipment/edit-equipment.dto';
import { GetDetailedEquipmentDto } from 'src/models/equipment/get-detailed-equipment.dto';
import { EquipmentService } from 'src/services/equipment.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './edit-equipment.component.html',
  styleUrls: ['./edit-equipment.component.scss'],
})
export class EditEquipmentComponent implements OnInit {
  editForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
  });

  equipmentId = 0;
  isLoading = false;

  constructor(
    private equipmentService: EquipmentService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.equipmentId = params['id'];
    });

    this.isLoading = true;

    this.equipmentService
      .getDetailedEquipment(this.equipmentId)
      .subscribe((equipment: GetDetailedEquipmentDto) => {
        this.editForm = new FormGroup({
          name: new FormControl(equipment.name),
          description: new FormControl(equipment.description),
        });
        this.isLoading = false;
      });
  }

  onSubmit() {
    let equipment = this.editForm.value as EditEquipmentDto;
    equipment.id = this.equipmentId;

    this.isLoading = true;

    this.equipmentService.editEquipment(equipment).subscribe(
      (res: any) => {
        this.router.navigate(['/equipment']).then(() => {
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
