// Use Case ini tugasnya sederhana, hanya meneruskan panggilan ke repository
export class GetCategoriesUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    // Repository sudah akan mengembalikan tipe Either (Right/Left)
    return await this.repository.getCategories();
  }
}