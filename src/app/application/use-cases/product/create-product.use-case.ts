import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductEntity } from '../../../domain/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(productData: {
    id: string;
    name: string;
    description: string;
    logo: string;
    dateRelease: Date;
    dateRevision: Date;
  }): Observable<ProductEntity> {
    return this.verifyUniqueId(productData.id).pipe(
      switchMap(() => {
        const product = ProductEntity.create(productData);
        return this.productRepository.create(product);
      }),
      catchError(error => {
        console.error('Error al crear producto:', error);
        return throwError(() => error);
      })
    );
  }

  private verifyUniqueId(id: string): Observable<void> {
    return this.productRepository.verifyIdExists(id).pipe(
      switchMap(exists => {
        if (exists) {
          return throwError(() => new Error('El ID ya existe en el sistema'));
        }
        return new Observable(subscriber => {
          subscriber.next();
          subscriber.complete();
        });
      })
    );
  }
}
