import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { IGetContainersOrderedByTransferDate } from 'src/models/container/get-containers-ordered-by-transfer-date';
import { ContainerService } from 'src/services/container.service';

@Component({
  templateUrl: './next-transfers.component.html',
  styleUrls: ['./next-transfers.component.scss'],
})
export class NextTransfersComponent implements OnInit {
  isLoading = false;
  faPen = faPen as IconProp;

  containers: IGetContainersOrderedByTransferDate[] = [];

  constructor(private containerService: ContainerService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.containerService.getContainersOrderedByTransferDate().subscribe(
      (containers: IGetContainersOrderedByTransferDate[]) => {
        this.containers = containers;
        this.isLoading = false;
      },
      (err) => (this.isLoading = false)
    );
  }

  onScroll() {
    this.isLoading = true;
    this.containerService.getContainersOrderedByTransferDate().subscribe(
      (containers: IGetContainersOrderedByTransferDate[]) => {
        this.containers.push(...containers);
        this.isLoading = false;
      },
      (err) => (this.isLoading = false)
    );
  }
}
