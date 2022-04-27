import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-back-arrow',
  templateUrl: './back-arrow.component.html',
  styleUrls: ['./back-arrow.component.scss']
})
export class BackArrowComponent implements OnInit {

  faAngleLeft = faAngleLeft as IconProp;

  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  onBack() {
    this.location.back();
  }
}
