import { TestBed, inject } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { ProductsDataService } from './products-data.service';
import { of } from 'rxjs'; // Importe 'of' para criar observáveis mock

describe('ProductsService', () => {
  let productsService: ProductsService;
  let dataservice: ProductsDataService;
  const fakeObservable = of(); // Use 'of' para criar um observable mock

  beforeEach(() => {
    dataservice = jasmine.createSpyObj('data service', {
      fetchAll: fakeObservable,
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: ProductsDataService, useValue: dataservice },
        ProductsService,
      ],
    });
  });

  beforeEach(inject([ProductsService], (service: ProductsService) => {
    productsService = service;
  }));

  it('should be created', () => {
    expect(productsService).toBeTruthy();
  });

  it('can fetch all products', () => {
    productsService.fetchAll();
    expect(dataservice.fetchAll).toHaveBeenCalled();
  });
});
