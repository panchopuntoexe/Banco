import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductEntity } from '../../../domain/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(productData: {
    id: string;
    name: string;
    description: string;
    logo: string;
    dateRelease: Date;
    dateRevision: Date;
  }): Observable<ProductEntity> {
    return this.updateProduct(productData).pipe(
      catchError(error => {
        console.error('Error al actualizar producto:', error);
        return throwError(() => error);
      })
    );
  }

  private updateProduct(productData: {
    id: string;
    name: string;
    description: string;
    logo: string;
    dateRelease: Date;
    dateRevision: Date;
  }): Observable<ProductEntity> {
    const product = ProductEntity.create(productData);
    return this.productRepository.update(product);
  }
}
