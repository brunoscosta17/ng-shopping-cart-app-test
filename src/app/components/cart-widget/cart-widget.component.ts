import { Component, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'cart-widget',
    templateUrl: 'cart-widget.component.html',
    styleUrls: ['cart-widget.component.css'],
})
export class CartWidgetComponent implements OnDestroy {

  items$: Observable<any[]>;
  total$: Observable<number>;

  private destroy$ = new Subject<void>();

  constructor(public cart: CartService) {

    cart.getStoredCartItems();

    this.items$ = cart.getCartUpdates().pipe(takeUntil(this.destroy$));
    this.total$ = cart.getTotalUpdates().pipe(takeUntil(this.destroy$));

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
