import { Component, OnInit, ChangeDetectionStrategy, Input } from "@angular/core";
import { Subscription, Observable } from "rxjs";

import { Product } from "../../core/interfaces/product.interface";
import { CartItem } from "../../core/interfaces/cart-item.interface";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "cart-item-control",
  templateUrl: "cart-item-control.component.html",
  styleUrls: ["cart-item-control.component.css"],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CartItemControlComponent implements OnInit {
  @Input() product: Product;

  item$: Observable<CartItem>;

  item: CartItem;

  constructor(public cart: CartService) { }

  ngOnInit() {
    this.item = this.cart.getItem(this.product.id);
    this.item$ = this.cart.getItemUpdates(this.product.id);
    this.cart.getCartUpdates().subscribe({
      next: (item: CartItem[]) => this.item = item.find((item) => item.product.id === this.product.id),
    });
  }
}
