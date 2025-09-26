import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateExamQuestionDto } from "./create-exam-question.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateExamDto {
  @ApiProperty({ default: new Date().toISOString() })
  @IsDate({ message: 'Exam start time must be a valid Date' })
  @IsNotEmpty()
  @Type(() => Date)
  exam_start_time: Date;

  @ApiProperty({ default: new Date().toISOString() })
  @IsDate({ message: 'Exam end time must be a valid Date' })
  @IsNotEmpty()
  @Type(() => Date)
  exam_end_time: Date;

  @ApiProperty({ example: true })
  @IsBoolean({ message: "is_negative_marking must be true or false" })
  is_negative_marking: boolean;

  @ApiPropertyOptional({ example: 0.25 })
  @IsOptional()
  @IsNumber({}, { message: "Negative mark value must be a number" })
  @Min(0, { message: "Negative mark value must be greater than or equal to 0" })
  negative_mark_value?: number;

  @ApiProperty({ example: "Mathematics" })
  @IsNotEmpty({ message: "Subject must be provided" })
  @IsString({ message: "Subject must be a string" })
  @MaxLength(100, { message: "Subject can be maximum 100 characters" })
  subject: string;

  @ApiProperty({
    type: [CreateExamQuestionDto],
    description: "List of questions for the exam",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExamQuestionDto)
  questions: CreateExamQuestionDto[];
}
