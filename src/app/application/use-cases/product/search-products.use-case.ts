import { Injectable } from '@angular/core';
import { ProductEntity } from '../../../domain/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class SearchProductsUseCase {
  execute(products: ProductEntity[], searchTerm: string): ProductEntity[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return products;
    }

    const normalizedTerm = this.normalizeSearchTerm(searchTerm);
    
    return products.filter(product => 
      this.matchesSearchTerm(product, normalizedTerm)
    );
  }

  private normalizeSearchTerm(term: string): string {
    return term.toLowerCase().trim();
  }

  private matchesSearchTerm(product: ProductEntity, normalizedTerm: string): boolean {
    const searchableFields = [
      product.id.toLowerCase(),
      product.name.toLowerCase(),
      product.description.toLowerCase()
    ];

    return searchableFields.some(field => field.includes(normalizedTerm));
  }
}
