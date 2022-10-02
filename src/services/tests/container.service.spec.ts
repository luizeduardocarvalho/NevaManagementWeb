// import { HttpClient } from '@angular/common/http';
// import { of } from 'rxjs';
// import { GetDetailedContainer } from 'src/models/container/get-detailed-container.dto';
// import { GetSimpleContainer } from 'src/models/container/get-simple-container.dto';
// import { ContainerService } from '../container.service';
// import { TokenService } from '../token.service';

// let httpClientSpy: jasmine.SpyObj<HttpClient>;
// let tokenServiceSpy: jasmine.SpyObj<TokenService>;
// let service: ContainerService;

// beforeEach(() => {
//   httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
//   tokenServiceSpy = jasmine.createSpyObj('TokenService', ['get']);
//   service = new ContainerService(httpClientSpy, tokenServiceSpy);
// });

// describe('ContainerService', () => {
//   it('#getContainers should return list with one call', (done: DoneFn) => {
//     const expectedContainers: GetSimpleContainer[] = [
//       { id: 1, name: 'Container 1' },
//       { id: 2, name: 'Container 2' },
//     ];

//     httpClientSpy.get.and.returnValue(of(expectedContainers));

//     service.getContainers().subscribe({
//       next: (containers) => {
//         expect(containers)
//           .withContext('expected containers')
//           .toEqual(expectedContainers);
//         done();
//       },
//       error: done.fail,
//     });

//     expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
//   });

//   it('#addContainer should be called once', (done: DoneFn) => {

//     const addContainer = new IAddContainer(
//       'Container 1',
//       'Description',
//       'Culture Media',
//       1,
//       1,
//       1,
//       new Date()
//     );

//     httpClientSpy.post.and.returnValue(of(addContainer));

//     service.addContainer(addContainer).subscribe({
//       next: () => done(),
//       error: done.fail,
//     });

//     expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
//   });

//   it('#getChildrenContainers should return list with one call', (done: DoneFn) => {
//     const expectedContainers: GetSimpleContainer[] = [
//       { id: 1, name: 'Container 1' },
//       { id: 2, name: 'Container 2' },
//     ];

//     httpClientSpy.get.and.returnValue(of(expectedContainers));

//     service.getChildrenContainers(1).subscribe({
//       next: (containers) => {
//         expect(containers)
//           .withContext('expected containers')
//           .toEqual(expectedContainers);
//         done();
//       },
//       error: done.fail,
//     });

//     expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
//   });

//   it('#getDetailedContainer should return single container with one call', (done: DoneFn) => {
//     const expectedContainer = new GetDetailedContainer(
//       'Container 1',
//       'Culture Media',
//       'Researcher 1',
//       'Description',
//       'Origin',
//       new Date()
//     );

//     httpClientSpy.get.and.returnValue(of(expectedContainer));

//     service.getDetailedContainer(1).subscribe({
//       next: (containers) => {
//         expect(containers)
//           .withContext('expected containers')
//           .toEqual(expectedContainer);
//         done();
//       },
//       error: done.fail,
//     });

//     expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
//   });
// });
