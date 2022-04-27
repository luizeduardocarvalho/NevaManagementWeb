import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPen, faSearch } from '@fortawesome/free-solid-svg-icons';
import { GetSimpleOrganism } from 'src/models/organism/get-simple-organism.dto';
import { OrganismService } from 'src/services/organism.service';

@Component({
  templateUrl: './organism-list.component.html',
  styleUrls: ['./organism-list.component.scss']
})
export class OrganismListComponent implements OnInit {

  faSearch = faSearch as IconProp;
  faPen = faPen as IconProp;
  
  searchText: string = '';
  organisms: GetSimpleOrganism[] = [];

  isLoading = false;

  constructor(private organismService: OrganismService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.organismService
      .getOrganisms()
      .subscribe(
        (organisms: GetSimpleOrganism[]) => {
          this.organisms = organisms;
          this.isLoading = false;
        }
      );
  }

}
