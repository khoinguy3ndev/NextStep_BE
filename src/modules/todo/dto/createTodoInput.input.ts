import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

@InputType()
export class CreateTodoInput {

  @Field()
  @IsString()
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field()
  @IsDateString()
  startDate!: string;

  @Field()
  @IsDateString()
  endDate!: string;
}
