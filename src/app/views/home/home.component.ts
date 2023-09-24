import { ForProductDirective } from './../../core/directives/for-product.directive';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductsService } from '../../services/products.service';
import { Product } from '../../core/interfaces/product.interface';

@Component({
    selector: 'home-page',
    templateUrl: 'home.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.Default
})
export class HomePageComponent implements OnInit {

  products$: Observable<Product[]>;
  // @ViewChild(ForProductDirective, { read: TemplateRef }) customDefaultTemplate: TemplateRef<any>;

  constructor(public products: ProductsService) {
    this.products$ = this.products.fetchAll();
  }

  ngOnInit() { }
}
