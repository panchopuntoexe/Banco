import { ProductEntity } from './product.model';

describe('ProductEntity', () => {
  const validProductData = {
    id: 'TEST123',
    name: 'Producto de prueba',
    description: 'Descripción válida del producto',
    logo: 'https://example.com/logo.png',
    dateRelease: new Date('2026-12-31'),
    dateRevision: new Date('2027-12-31')
  };

  describe('create', () => {
    it('should create a valid product entity', () => {
      const product = ProductEntity.create(validProductData);

      expect(product).toBeDefined();
      expect(product.id).toBe(validProductData.id);
      expect(product.name).toBe(validProductData.name);
      expect(product.description).toBe(validProductData.description);
      expect(product.logo).toBe(validProductData.logo);
    });

    it('should throw error when id is too short', () => {
      const invalidData = { ...validProductData, id: 'AB' };

      expect(() => ProductEntity.create(invalidData)).toThrowError(
        'El ID debe tener entre 3 y 10 caracteres'
      );
    });

    it('should throw error when id is too long', () => {
      const invalidData = { ...validProductData, id: '12345678901' };

      expect(() => ProductEntity.create(invalidData)).toThrowError(
        'El ID debe tener entre 3 y 10 caracteres'
      );
    });

    it('should throw error when name is too short', () => {
      const invalidData = { ...validProductData, name: 'ABC' };

      expect(() => ProductEntity.create(invalidData)).toThrowError(
        'El nombre debe tener entre 6 y 100 caracteres'
      );
    });

    it('should throw error when name is too long', () => {
      const invalidData = { ...validProductData, name: 'A'.repeat(101) };

      expect(() => ProductEntity.create(invalidData)).toThrowError(
        'El nombre debe tener entre 6 y 100 caracteres'
      );
    });

    it('should throw error when description is too short', () => {
      const invalidData = { ...validProductData, description: 'Short' };

      expect(() => ProductEntity.create(invalidData)).toThrowError(
        'La descripción debe tener entre 10 y 200 caracteres'
      );
    });

    it('should throw error when description is too long', () => {
      const invalidData = { ...validProductData, description: 'A'.repeat(201) };

      expect(() => ProductEntity.create(invalidData)).toThrowError(
        'La descripción debe tener entre 10 y 200 caracteres'
      );
    });

    it('should throw error when date release is in the past', () => {
      const invalidData = {
        ...validProductData,
        dateRelease: new Date('2020-01-01'),
        dateRevision: new Date('2021-01-01')
      };

      expect(() => ProductEntity.create(invalidData)).toThrowError(
        'La fecha de liberación debe ser mayor a la fecha actual'
      );
    });

    it('should throw error when date revision is not exactly one year after release', () => {
      const invalidData = {
        ...validProductData,
        dateRelease: new Date('2026-12-31'),
        dateRevision: new Date('2027-11-30') // No es exactamente un año después
      };

      expect(() => ProductEntity.create(invalidData)).toThrowError(
        'La fecha de revisión debe ser exactamente un año después de la fecha de liberación'
      );
    });
  });

  describe('update', () => {
    it('should update product maintaining immutability', () => {
      const originalProduct = ProductEntity.create(validProductData);
      const updatedProduct = originalProduct.update({
        name: 'Nombre actualizado'
      });

      expect(originalProduct.name).toBe(validProductData.name);
      expect(updatedProduct.name).toBe('Nombre actualizado');
      expect(originalProduct.id).toBe(updatedProduct.id);
      expect(originalProduct).not.toBe(updatedProduct);
    });

    it('should allow partial updates', () => {
      const originalProduct = ProductEntity.create(validProductData);
      const updatedProduct = originalProduct.update({
        description: 'Nueva descripción actualizada'
      });

      expect(updatedProduct.name).toBe(originalProduct.name);
      expect(updatedProduct.description).toBe('Nueva descripción actualizada');
    });

    it('should throw error when updated data is invalid', () => {
      const product = ProductEntity.create(validProductData);

      expect(() => product.update({ name: 'ABC' })).toThrowError(
        'El nombre debe tener entre 6 y 100 caracteres'
      );
    });
  });
});
