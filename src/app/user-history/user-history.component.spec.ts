import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SearchPipe } from 'src/pipes/search.pipe';
import { ProductUsageService } from 'src/services/product-usage.service';
import { UserService } from 'src/services/user.service';
import { UserHistoryComponent } from './user-history.component';

describe('UserHistoryComponent', () => {
  let httpMock: HttpTestingController;
  let component: UserHistoryComponent;
  let fixture: ComponentFixture<UserHistoryComponent>;

  let userService: UserService;
  let productUsageService: ProductUsageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [SearchPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    userService = TestBed.inject(UserService);
    productUsageService = TestBed.inject(ProductUsageService);

    fixture = TestBed.createComponent(UserHistoryComponent);
    httpMock = fixture.debugElement.injector.get<HttpTestingController>(
      HttpTestingController as Type<HttpTestingController>
      );
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    
  // it('#isLoading should be false at the start', () => {
  //   expect(component.isLoading).toBe(false);
  // });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call #getUser and #getLastUsesByResearcher once', () => {
    // Arrange
    // const user = new User(1, 'User', 'Email', 'Token', {});

    const userServiceSpy = spyOn(userService, 'getUser');
    const productUsageServiceSpy = spyOn(
      productUsageService,
      'getLastUsesByResearcher'
    );

    // userServiceSpy.and.returnValue(user);
    // productUsageServiceSpy.and.returnValue(of([]));

    // Act
    component.ngOnInit();

    // Assert
    expect(userServiceSpy).toHaveBeenCalledTimes(1);
    // expect(productUsageServiceSpy).toHaveBeenCalledOnceWith(user.id);
  });

});
