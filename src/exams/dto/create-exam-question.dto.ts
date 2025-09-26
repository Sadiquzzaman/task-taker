import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";

export enum CorrectAnswerEnum {
  OPTION_1 = "Option 1",
  OPTION_2 = "Option 2",
  OPTION_3 = "Option 3",
  OPTION_4 = "Option 4",
}

export class CreateExamQuestionDto {
  @ApiProperty({ example: "What is the capital of Bangladesh?" })
  @IsNotEmpty({ message: "Question must be provided" })
  @IsString({ message: "Question must be a string" })
  @MaxLength(500, { message: "Question can be maximum 500 characters" })
  question: string;

  @ApiProperty({ example: "Dhaka" })
  @IsNotEmpty({ message: "Option 1 must be provided" })
  @IsString({ message: "Option 1 must be a string" })
  @MaxLength(255, { message: "Option 1 can be maximum 255 characters" })
  option1: string;

  @ApiProperty({ example: "Chittagong" })
  @IsNotEmpty({ message: "Option 2 must be provided" })
  @IsString({ message: "Option 2 must be a string" })
  @MaxLength(255, { message: "Option 2 can be maximum 255 characters" })
  option2: string;

  @ApiProperty({ example: "Khulna" })
  @IsNotEmpty({ message: "Option 3 must be provided" })
  @IsString({ message: "Option 3 must be a string" })
  @MaxLength(255, { message: "Option 3 can be maximum 255 characters" })
  option3: string;

  @ApiProperty({ example: "Rajshahi" })
  @IsNotEmpty({ message: "Option 4 must be provided" })
  @IsString({ message: "Option 4 must be a string" })
  @MaxLength(255, { message: "Option 4 can be maximum 255 characters" })
  option4: string;

  @ApiProperty({ enum: CorrectAnswerEnum, example: CorrectAnswerEnum.OPTION_1 })
  @IsEnum(CorrectAnswerEnum, {
    message:
      "Correct answer must be one of: Option 1, Option 2, Option 3, Option 4",
  })
  correct_answer: CorrectAnswerEnum;

  @ApiPropertyOptional({ example: "Dhaka is the capital of Bangladesh" })
  @IsOptional()
  @IsString({ message: "Explanation must be a string" })
  @MaxLength(1000, { message: "Explanation can be maximum 1000 characters" })
  explanation?: string;
}
