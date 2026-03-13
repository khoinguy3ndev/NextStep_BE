import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CompanyService } from "./company.service";
import { Company } from "src/entities/company.entity";
import { CreateCompanyInput } from "./dto/create-company.input";
import { UpdateCompanyInput } from "./dto/update-company.input";

@Resolver(() => Company)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Query(() => [Company])
  async getAllCompanies(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Query(() => Company, { nullable: true })
  async getCompanyById(
    @Args("companyId", { type: () => Int }) companyId: number,
  ): Promise<Company | null> {
    return this.companyService.findById(companyId);
  }

  @Mutation(() => Company)
  async createCompany(
    @Args("input") input: CreateCompanyInput,
  ): Promise<Company> {
    return this.companyService.createCompany(input);
  }

  @Mutation(() => Company)
  async updateCompany(
    @Args("input") input: UpdateCompanyInput,
  ): Promise<Company> {
    return this.companyService.updateCompany(input);
  }

  @Mutation(() => Boolean)
  async deleteCompany(
    @Args("companyId", { type: () => Int }) companyId: number,
  ): Promise<boolean> {
    return this.companyService.deleteCompany(companyId);
  }
}
