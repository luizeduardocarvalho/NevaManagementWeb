import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faHome, faList, faReceipt, faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  faHome = faHome as IconProp;
  faList = faList as IconProp;
  faReceipt = faReceipt as IconProp;
  faBars = faBars as IconProp;

  constructor() { }

  ngOnInit(): void {
  }

}
