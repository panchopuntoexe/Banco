import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ProductRepository } from '../../../domain/repositories/product.repository';

@Injectable({
  providedIn: 'root'
})
export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(id: string): Observable<void> {
    if (!id || id.trim() === '') {
      return throwError(() => new Error('ID de producto inválido'));
    }

    return this.productRepository.delete(id).pipe(
      catchError(error => {
        console.error('Error al eliminar producto:', error);
        return throwError(() => new Error('No se pudo eliminar el producto'));
      })
    );
  }
}
