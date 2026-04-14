import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Job } from "src/entities/job.entity";
import { Skill } from "src/entities/skill.entity";
import { CreateSkillInput } from "./dto/create-skill.input";
import { UpdateSkillInput } from "./dto/update-skill.input";
import { SkillService } from "./skill.service";

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  @Query(() => [Skill])
  async getAllSkills(): Promise<Skill[]> {
    return this.skillService.findAll();
  }

  @Query(() => Skill, { nullable: true })
  async skill(
    @Args("skillId", { type: () => Int }) skillId: number,
  ): Promise<Skill | null> {
    return this.skillService.findSkillById(skillId);
  }

  @Mutation(() => Skill)
  async createSkill(@Args("input") input: CreateSkillInput): Promise<Skill> {
    return this.skillService.createSkill(input);
  }

  @Mutation(() => Skill)
  async updateSkill(
    @Args("skillId", { type: () => Int }) skillId: number,
    @Args("input") input: UpdateSkillInput,
  ): Promise<Skill> {
    return this.skillService.updateSkill(skillId, {
      name: input.name,
      category: input.category,
      isActive: input.isActive,
    });
  }

  @Mutation(() => Boolean)
  async deleteSkill(
    @Args("skillId", { type: () => Int }) skillId: number,
  ): Promise<boolean> {
    return this.skillService.deleteSkill(skillId);
  }

  @Mutation(() => Job)
  async addSkillsToJob(
    @Args("jobId", { type: () => Int }) jobId: number,
    @Args({ name: "skillIds", type: () => [Int] }) skillIds: number[],
  ): Promise<Job> {
    return this.skillService.addSkillsToJob(jobId, skillIds);
  }
}
