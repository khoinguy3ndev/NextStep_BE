import { EntityManager } from "@mikro-orm/postgresql";
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { Company } from "src/entities/company.entity";
import { CreateCompanyInput } from "./dto/create-company.input";
import { UpdateCompanyInput } from "./dto/update-company.input";

@Injectable()
export class CompanyService {
  constructor(private readonly em: EntityManager) {}

  async findAll(): Promise<Company[]> {
    return this.em.find(Company, {});
  }

  async findById(companyId: number): Promise<Company | null> {
    return this.em.findOne(Company, { companyId });
  }

  async createCompany(input: CreateCompanyInput): Promise<Company> {
    // Kiểm tra xem tên công ty đã tồn tại chưa (do bạn set unique: true)
    const existingCompany = await this.em.findOne(Company, {
      name: input.name,
    });
    if (existingCompany) {
      throw new ConflictException("Tên công ty này đã tồn tại trong hệ thống!");
    }

    const { companyId, ...data } = input as any;
    const company = this.em.create(Company, data);
    await this.em.persistAndFlush(company);
    return company;
  }

  async updateCompany(input: UpdateCompanyInput): Promise<Company> {
    const { companyId, ...updateData } = input;

    const company = await this.findById(companyId);
    if (!company) {
      throw new NotFoundException("Không tìm thấy công ty!");
    }

    // Nếu có đổi tên công ty, phải kiểm tra xem tên mới có bị trùng với công ty khác không
    if (updateData.name && updateData.name !== company.name) {
      const existingCompany = await this.em.findOne(Company, {
        name: updateData.name,
      });
      if (existingCompany) {
        throw new ConflictException(
          "Tên công ty này đã tồn tại trong hệ thống!",
        );
      }
    }

    this.em.assign(company, updateData);
    await this.em.persistAndFlush(company);

    return company;
  }

  async deleteCompany(companyId: number): Promise<boolean> {
    const company = await this.findById(companyId);
    if (!company) return false;

    await this.em.removeAndFlush(company);
    return true;
  }
}
