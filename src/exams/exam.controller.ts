import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CreateExamDto } from "./dto/create-exam.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/common/guard/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesEnum } from "src/common/enums/roles.enum";
import { JwtPayloadInterface } from "src/auth/interfaces/jwt-payload.interface";
import { UserPayload } from "src/common/decorators/user-payload.decorator";
import { ExamService } from "./exam.service";

@ApiTags("Exams")
@Controller({
  path: "exams",
  version: "1",
})
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @ApiBearerAuth("jwt")
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Roles(RolesEnum.TEACHER)
  @Post()
  async create(
    @Body() dto: CreateExamDto,
    @UserPayload() jwtPayload: JwtPayloadInterface,
  ) {
    try {
      const payload = await this.examService.create(dto, jwtPayload);
      return { message: "Exam created successfully", payload };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      const payload = await this.examService.findAll();
      return { message: "All exams list", payload };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const payload = await this.examService.findOne(id);
      return { message: "Exam details", payload };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
