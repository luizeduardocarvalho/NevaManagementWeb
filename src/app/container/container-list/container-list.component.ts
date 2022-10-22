import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPen, faReceipt, faSearch } from '@fortawesome/free-solid-svg-icons';
import { GetSimpleContainer } from 'src/models/container/get-simple-container.dto';
import { ContainerService } from 'src/services/container.service';

@Component({
  templateUrl: './container-list.component.html',
  styleUrls: ['./container-list.component.scss'],
})
export class ContainerListComponent implements OnInit {
  faSearch = faSearch as IconProp;
  faReceipt = faReceipt as IconProp;

  containers: GetSimpleContainer[] = [];
  searchText = '';

  isLoading = false;

  constructor(private containerService: ContainerService) {}

  ngOnInit(): void {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    this.isLoading = true;
    this.containerService
      .getContainers()
      .subscribe((containers: GetSimpleContainer[]) => {
        this.containers = containers;
        this.isLoading = false;
      });
  }
}
