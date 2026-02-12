export class ProductEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly logo: string,
    public readonly dateRelease: Date,
    public readonly dateRevision: Date
  ) {
    this.validateInvariants();
  }

  private validateInvariants(): void {
    if (!this.id || this.id.length < 3 || this.id.length > 10) {
      throw new Error('El ID debe tener entre 3 y 10 caracteres');
    }

    if (!this.name || this.name.length < 6 || this.name.length > 100) {
      throw new Error('El nombre debe tener entre 6 y 100 caracteres');
    }

    if (!this.description || this.description.length < 10 || this.description.length > 200) {
      throw new Error('La descripción debe tener entre 10 y 200 caracteres');
    }

    if (this.dateRelease <= new Date()) {
      throw new Error('La fecha de liberación debe ser mayor a la fecha actual');
    }

    const expectedRevisionDate = new Date(this.dateRelease);
    expectedRevisionDate.setFullYear(expectedRevisionDate.getFullYear() + 1);

    if (this.dateRevision.getTime() !== expectedRevisionDate.getTime()) {
      throw new Error('La fecha de revisión debe ser exactamente un año después de la fecha de liberación');
    }
  }

  static create(params: {
    id: string;
    name: string;
    description: string;
    logo: string;
    dateRelease: Date;
    dateRevision: Date;
  }): ProductEntity {
    return new ProductEntity(
      params.id,
      params.name,
      params.description,
      params.logo,
      params.dateRelease,
      params.dateRevision
    );
  }

  update(params: Partial<Omit<ProductEntity, 'id'>>): ProductEntity {
    return new ProductEntity(
      this.id,
      params.name ?? this.name,
      params.description ?? this.description,
      params.logo ?? this.logo,
      params.dateRelease ?? this.dateRelease,
      params.dateRevision ?? this.dateRevision
    );
  }
}
