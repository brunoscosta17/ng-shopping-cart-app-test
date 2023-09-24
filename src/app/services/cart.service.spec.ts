import { CartDataService } from './cart-data.service';
import { CartItem } from '../core/interfaces/cart-item.interface';
import { TestBed, inject } from '@angular/core/testing';

import { CartService } from './cart.service';
import { Subject } from 'rxjs';

import { buffer } from 'rxjs/operators';

describe('CartService', () => {
    let cart: CartService;
    let dataservice: CartDataService;
    const product_A = { id: 123, price: 100, name: 'Motorola' };
    const product_B = { id: 124, price: 150, name: 'Fancy Car' };
    const fakeObservable = { subscribe: () => { } };

    beforeEach(() => {
        dataservice = jasmine.createSpyObj('data service', {
            persist: fakeObservable,
            remove: fakeObservable,
            fetchAll: fakeObservable,
            fetchOne: fakeObservable,
        });

        TestBed.configureTestingModule({
            providers: [
                { provide: CartDataService, useValue: dataservice },
                CartService
            ]
        });
    });

    beforeEach(inject([CartService], (service: CartService) => {
        cart = service;
    }));

    it('should add product to cart', () => {
        cart.addProduct(product_A)
        expect(cart.getItems().length).toEqual(1);
        cart.addProduct(product_B);
        expect(cart.getItems().length).toEqual(2);
    })

    it('should remove product from cart', () => {
      cart.addProduct(product_A);
      cart.addProduct(product_B);
      cart.removeProduct(product_A);
      expect(cart.getItems().length).toEqual(1);
      cart.removeProduct(product_B);
      expect(cart.getItems().length).toEqual(0);
  });

    it('aggregate same products as one item, tracks amount', () => {
        cart.addProduct(product_A);
        cart.addProduct(product_B);
        expect(cart.getItem(product_A.id).amount).toEqual(1);
        expect(cart.getItem(product_B.id).amount).toEqual(1);
        cart.addProduct(product_A);
        expect(cart.getItem(product_A.id).amount).toEqual(2);
        cart.addProduct(product_A);
        expect(cart.getItem(product_A.id).amount).toEqual(3);

    })

    it('calculates subtotal price for each item based on that item amount', () => {
        cart.addProduct(product_A);
        cart.addProduct(product_A);
        expect(cart.getItem(product_A.id).subtotal).toEqual(200);
        cart.addProduct(product_A);
        expect(cart.getItem(product_A.id).subtotal).toEqual(300);
        cart.removeProduct(product_A);
        expect(cart.getItem(product_A.id).subtotal).toEqual(200);
    })

    it('calculates total price of items in cart', () => {
      cart.addProduct(product_A);
      cart.addProduct(product_A);
      cart.addProduct(product_B);
      expect(cart.getTotal()).toEqual(350);
      cart.addProduct(product_A);
      cart.addProduct(product_B);
      expect(cart.getTotal()).toEqual(600);
      cart.removeProduct(product_B);
      expect(cart.getTotal()).toEqual(450);
  });


    it('notifies subscribers on cart item changes', (done) => {
      let update;
      let isUpdateReceived = false;

      // Subscribe to cart item updates
      const subscription = cart.getItemUpdates(product_A.id).subscribe((u) => {
          update = u;
          isUpdateReceived = true;
          subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
      });

      // Add a product to trigger the update
      cart.addProduct(product_A);

      // Use a timeout to allow for asynchronous updates
      setTimeout(() => {
          expect(isUpdateReceived).toBe(true);
          done(); // Call done to complete the async test
      }, 100);
  });

    it('notifies with most recent cart state imediately on subscription', () => {
        let update = { amount: 0 };

        cart.getItemUpdates(product_A.id)
            .subscribe(u => {
                update = u;
            });

        cart.addProduct(product_A);
        cart.addProduct(product_A);

        expect(update.amount).toEqual(2);
    });
});
