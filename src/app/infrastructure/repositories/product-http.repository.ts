import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { ProductEntity } from '../../domain/models/product.model';
import { ProductMapper } from '../mappers/product.mapper';
import { ApiResponse } from '../../utils/models/api.interface';
import { Product } from '../../utils/models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductHttpRepository extends ProductRepository {
  private readonly apiUrl = '/api/bp/products';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private readonly http: HttpClient) {
    super();
  }

  getAll(): Observable<ProductEntity[]> {
    return this.http
      .get<ApiResponse<Product[]>>(this.apiUrl, { headers: this.headers })
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Respuesta inválida del servidor');
          }
          return ProductMapper.toDomainList(response.data);
        })
      );
  }

  getById(id: string): Observable<ProductEntity> {
    return this.http
      .get<ApiResponse<Product>>(`${this.apiUrl}/${id}`, { headers: this.headers })
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Producto no encontrado');
          }
          return ProductMapper.toDomain(response.data);
        })
      );
  }

  create(product: ProductEntity): Observable<ProductEntity> {
    const dto = ProductMapper.toDTO(product);
    return this.http
      .post<ApiResponse<Product>>(this.apiUrl, dto, { headers: this.headers })
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Error al crear el producto');
          }
          return ProductMapper.toDomain(response.data);
        })
      );
  }

  update(product: ProductEntity): Observable<ProductEntity> {
    const dto = ProductMapper.toDTO(product);
    return this.http
      .put<ApiResponse<Product>>(`${this.apiUrl}/${product.id}`, dto, { headers: this.headers })
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Error al actualizar el producto');
          }
          return ProductMapper.toDomain(response.data);
        })
      );
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<Product>>(`${this.apiUrl}/${id}`, { headers: this.headers })
      .pipe(map(() => undefined));
  }

  verifyIdExists(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`, { headers: this.headers });
  }
}
