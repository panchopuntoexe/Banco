import { TestBed } from '@angular/core/testing';
import { SearchProductsUseCase } from './search-products.use-case';
import { ProductEntity } from '../../../domain/models/product.model';

describe('SearchProductsUseCase', () => {
  let useCase: SearchProductsUseCase;

  const mockProducts: ProductEntity[] = [
    ProductEntity.create({
      id: 'CARD001',
      name: 'Tarjeta de Crédito Oro',
      description: 'Tarjeta premium con beneficios exclusivos',
      logo: 'card-gold.png',
      dateRelease: new Date('2026-01-01'),
      dateRevision: new Date('2027-01-01')
    }),
    ProductEntity.create({
      id: 'LOAN002',
      name: 'Préstamo Personal',
      description: 'Préstamo con tasa preferencial',
      logo: 'loan.png',
      dateRelease: new Date('2026-02-01'),
      dateRevision: new Date('2027-02-01')
    }),
    ProductEntity.create({
      id: 'SAVE003',
      name: 'Cuenta de Ahorros',
      description: 'Cuenta con alta rentabilidad',
      logo: 'savings.png',
      dateRelease: new Date('2026-03-01'),
      dateRevision: new Date('2027-03-01')
    })
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchProductsUseCase]
    });

    useCase = TestBed.inject(SearchProductsUseCase);
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  describe('execute', () => {
    it('should return all products when search term is empty', () => {
      const result = useCase.execute(mockProducts, '');
      expect(result.length).toBe(3);
      expect(result).toEqual(mockProducts);
    });

    it('should return all products when search term is only whitespace', () => {
      const result = useCase.execute(mockProducts, '   ');
      expect(result.length).toBe(3);
      expect(result).toEqual(mockProducts);
    });

    it('should filter by product ID (case insensitive)', () => {
      const result = useCase.execute(mockProducts, 'card001');
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('CARD001');
    });

    it('should filter by product name (case insensitive)', () => {
      const result = useCase.execute(mockProducts, 'préstamo');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Préstamo Personal');
    });

    it('should filter by partial name match', () => {
      const result = useCase.execute(mockProducts, 'tarjeta');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Tarjeta de Crédito Oro');
    });

    it('should filter by description', () => {
      const result = useCase.execute(mockProducts, 'rentabilidad');
      expect(result.length).toBe(1);
      expect(result[0].description).toContain('rentabilidad');
    });

    it('should return multiple matching products', () => {
      const result = useCase.execute(mockProducts, 'cuenta');
      expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('should return empty array when no products match', () => {
      const result = useCase.execute(mockProducts, 'producto inexistente xyz');
      expect(result.length).toBe(0);
    });

    it('should trim search term before filtering', () => {
      const result = useCase.execute(mockProducts, '  CARD001  ');
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('CARD001');
    });

    it('should handle special characters in search term', () => {
      const result = useCase.execute(mockProducts, 'Crédito');
      expect(result.length).toBe(1);
      expect(result[0].name).toContain('Crédito');
    });

    it('should not mutate the original products array', () => {
      const originalLength = mockProducts.length;
      useCase.execute(mockProducts, 'any term');
      expect(mockProducts.length).toBe(originalLength);
    });
  });
});
