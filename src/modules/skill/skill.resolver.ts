import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Job } from "src/entities/job.entity";
import { Skill } from "src/entities/skill.entity";
import { CreateSkillInput } from "./dto/create-skill.input";
import { SkillService } from "./skill.service";

@Resolver(() => Skill)
export class SkillResolver {
  constructor(private readonly skillService: SkillService) {}

  @Query(() => [Skill])
  async getAllSkills(): Promise<Skill[]> {
    return this.skillService.findAll();
  }

  @Mutation(() => Skill)
  async createSkill(@Args("input") input: CreateSkillInput): Promise<Skill> {
    return this.skillService.createSkill(input);
  }

  @Mutation(() => Job)
  async addSkillsToJob(
    @Args("jobId", { type: () => Int }) jobId: number,
    @Args({ name: "skillIds", type: () => [Int] }) skillIds: number[],
  ): Promise<Job> {
    return this.skillService.addSkillsToJob(jobId, skillIds);
  }
}
