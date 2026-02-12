import { ProductEntity } from '../../domain/models/product.model';
import { Product } from '../../utils/models/product.interface';

export class ProductMapper {
  static toDomain(dto: Product): ProductEntity {
    return ProductEntity.create({
      id: dto.id,
      name: dto.name,
      description: dto.description,
      logo: dto.logo,
      dateRelease: new Date(dto.date_release),
      dateRevision: new Date(dto.date_revision)
    });
  }

  static toDTO(entity: ProductEntity): Product {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      logo: entity.logo,
      date_release: entity.dateRelease,
      date_revision: entity.dateRevision
    };
  }

  static toDomainList(dtos: Product[]): ProductEntity[] {
    return dtos.map(dto => this.toDomain(dto));
  }

  static toDTOList(entities: ProductEntity[]): Product[] {
    return entities.map(entity => this.toDTO(entity));
  }
}
