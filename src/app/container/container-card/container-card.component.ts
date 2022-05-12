import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { GetDetailedContainer } from 'src/models/container/get-detailed-container.dto';
import { GetSimpleContainer } from 'src/models/container/get-simple-container.dto';
import { ContainerService } from 'src/services/container.service';

@Component({
  selector: 'app-container-card',
  templateUrl: './container-card.component.html',
  styleUrls: ['./container-card.component.scss']
})
export class ContainerCardComponent implements OnInit {

  faReceipt = faReceipt as IconProp;

  container?: GetDetailedContainer;
  childrenContainers: GetSimpleContainer[] = [];
  containerId: number = 0;

  searchText = '';
  isLoading = false;

  constructor(
    private containerService: ContainerService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.containerId = params['id'];
    });
    
    this.isLoading = true;

    this.containerService
      .getChildrenContainers(this.containerId)
      .subscribe((containers: GetSimpleContainer[]) => {
        this.childrenContainers = containers;
        
        this.containerService
          .getDetailedContainer(this.containerId)
          .subscribe((container: GetDetailedContainer) => {
            this.container = container;

            this.isLoading = false;
          }
        );
      }
    );
  }
}
