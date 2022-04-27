import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPen, faSearch } from '@fortawesome/free-solid-svg-icons';
import { GetSimpleContainer } from 'src/models/container/get-simple-container.dto';
import { ContainerService } from 'src/services/container.service';

@Component({
  templateUrl: './container-list.component.html',
  styleUrls: ['./container-list.component.scss']
})
export class ContainerListComponent implements OnInit {

  faSearch = faSearch as IconProp;
  faPen = faPen as IconProp;

  containers: GetSimpleContainer[] = [];
  searchText = '';

  isLoading = false;

  constructor(private containerService: ContainerService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.containerService
      .getContainers()
      .subscribe((containers: GetSimpleContainer[]) => {
        this.containers = containers;
        this.isLoading = false;
      }
    );
  }
}
