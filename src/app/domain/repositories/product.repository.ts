import { Observable } from 'rxjs';
import { ProductEntity } from '../models/product.model';

export abstract class ProductRepository {
  abstract getAll(): Observable<ProductEntity[]>;
  abstract getById(id: string): Observable<ProductEntity>;
  abstract create(product: ProductEntity): Observable<ProductEntity>;
  abstract update(product: ProductEntity): Observable<ProductEntity>;
  abstract delete(id: string): Observable<void>;
  abstract verifyIdExists(id: string): Observable<boolean>;
}
