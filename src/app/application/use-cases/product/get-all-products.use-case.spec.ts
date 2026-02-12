import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GetAllProductsUseCase } from './get-all-products.use-case';
import { ProductRepository } from '../../../domain/repositories/product.repository';
import { ProductEntity } from '../../../domain/models/product.model';

describe('GetAllProductsUseCase', () => {
  let useCase: GetAllProductsUseCase;
  let mockRepository: jasmine.SpyObj<ProductRepository>;

  const mockProducts: ProductEntity[] = [
    ProductEntity.create({
      id: 'PROD1',
      name: 'Producto 1',
      description: 'Descripción del producto 1',
      logo: 'logo1.png',
      dateRelease: new Date('2027-06-01'),
      dateRevision: new Date('2028-06-01')
    }),
    ProductEntity.create({
      id: 'PROD2',
      name: 'Producto 2',
      description: 'Descripción del producto 2',
      logo: 'logo2.png',
      dateRelease: new Date('2027-09-01'),
      dateRevision: new Date('2028-09-01')
    }),
    ProductEntity.create({
      id: 'PROD3',
      name: 'Producto 3',
      description: 'Descripción del producto 3',
      logo: 'logo3.png',
      dateRelease: new Date('2027-12-01'),
      dateRevision: new Date('2028-12-01')
    })
  ];

  beforeEach(() => {
    const repositorySpy = jasmine.createSpyObj('ProductRepository', ['getAll']);

    TestBed.configureTestingModule({
      providers: [
        GetAllProductsUseCase,
        { provide: ProductRepository, useValue: repositorySpy }
      ]
    });

    useCase = TestBed.inject(GetAllProductsUseCase);
    mockRepository = TestBed.inject(ProductRepository) as jasmine.SpyObj<ProductRepository>;
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  describe('execute', () => {
    it('should return products sorted by release date (newest first)', (done) => {
      mockRepository.getAll.and.returnValue(of(mockProducts));

      useCase.execute().subscribe({
        next: (products) => {
          expect(products.length).toBe(3);
          expect(products[0].id).toBe('PROD3'); // Más reciente
          expect(products[1].id).toBe('PROD2');
          expect(products[2].id).toBe('PROD1'); // Más antiguo
          done();
        },
        error: done.fail
      });
    });

    it('should return empty array when repository returns empty array', (done) => {
      mockRepository.getAll.and.returnValue(of([]));

      useCase.execute().subscribe({
        next: (products) => {
          expect(products).toEqual([]);
          done();
        },
        error: done.fail
      });
    });

    it('should handle repository errors gracefully', (done) => {
      const error = new Error('Database error');
      mockRepository.getAll.and.returnValue(throwError(() => error));

      useCase.execute().subscribe({
        next: () => done.fail('Should have thrown an error'),
        error: (err) => {
          expect(err.message).toBe('No se pudieron cargar los productos');
          done();
        }
      });
    });

    it('should not mutate the original array from repository', (done) => {
      const originalProducts = [...mockProducts];
      mockRepository.getAll.and.returnValue(of(mockProducts));

      useCase.execute().subscribe({
        next: () => {
          expect(mockProducts).toEqual(originalProducts);
          done();
        },
        error: done.fail
      });
    });
  });
});
