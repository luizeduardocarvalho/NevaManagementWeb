import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPen, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { GetSimpleOrganism } from 'src/models/organism/get-simple-organism.dto';
import { OrganismService } from 'src/services/organism.service';

@Component({
  templateUrl: './organism-list.component.html',
  styleUrls: ['./organism-list.component.scss'],
})
export class OrganismListComponent implements OnInit {
  faSearch = faSearch as IconProp;
  faPen = faPen as IconProp;

  searchText: string = '';
  organisms: GetSimpleOrganism[] = [];

  isLoading = false;

  constructor(
    private organismService: OrganismService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    this.isLoading = true;
    this.organismService.getOrganisms().subscribe(
      (organisms: GetSimpleOrganism[]) => {
        this.organisms = organisms;
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        this.toastr.error(err.error.message, 'Error');
      }
    );
  }
}
