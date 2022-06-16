import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AddEquipmentDto } from 'src/models/equipment/add-equipment.dto';
import { EquipmentService } from 'src/services/equipment.service';
import { ToastService } from 'src/services/toast.service';

@Component({
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.scss'],
})
export class AddEquipmentComponent implements OnInit {
  createForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
  });

  isLoading = false;

  constructor(
    private equipmentService: EquipmentService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    let equipment = this.createForm.value as AddEquipmentDto;

    this.isLoading = true;

    this.equipmentService.addEquipment(equipment).subscribe(
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
