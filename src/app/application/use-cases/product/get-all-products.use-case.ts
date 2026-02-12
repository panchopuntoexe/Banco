import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductEntity } from '../../../domain/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class GetAllProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(): Observable<ProductEntity[]> {
    return this.productRepository.getAll().pipe(
      map(products => this.sortProductsByReleaseDate(products)),
      catchError(error => {
        console.error('Error al obtener productos:', error);
        return throwError(() => new Error('No se pudieron cargar los productos'));
      })
    );
  }

  private sortProductsByReleaseDate(products: ProductEntity[]): ProductEntity[] {
    return [...products].sort((a, b) => 
      b.dateRelease.getTime() - a.dateRelease.getTime()
    );
  }
}
