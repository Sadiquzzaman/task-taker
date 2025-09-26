import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExamEntity } from "./entities/exam.entity";
import { ExamQuestionEntity } from "./entities/exam-question.entity";
import { CreateExamDto } from "./dto/create-exam.dto";
import { JwtPayloadInterface } from "src/auth/interfaces/jwt-payload.interface";

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(ExamEntity)
    private readonly examRepo: Repository<ExamEntity>,

    @InjectRepository(ExamQuestionEntity)
    private readonly questionRepo: Repository<ExamQuestionEntity>
  ) {}

  async create(
    dto: CreateExamDto,
    jwtPayload: JwtPayloadInterface
  ): Promise<ExamEntity | null> {
    if (
      dto.is_negative_marking &&
      (!dto.negative_mark_value || dto.negative_mark_value <= 0)
    ) {
      throw new BadRequestException(
        "Negative mark value is required if negative marking is enabled and must be greater than 0"
      );
    }

    console.log("start", dto.exam_start_time, "end", dto.exam_end_time);

    // ✅ Create exam
    const exam = this.examRepo.create({
      exam_start_time: dto.exam_start_time,
      exam_end_time: dto.exam_end_time,
      is_negative_marking: dto.is_negative_marking,
      negative_mark_value: dto.negative_mark_value,
      subject: dto.subject,
      created_by: jwtPayload.id,
      created_user_name: `${jwtPayload.first_name} ${jwtPayload.last_name}`,
      created_at: new Date(),
    });

    // ✅ Save exam first
    const savedExam = await this.examRepo.save(exam);

    // ✅ Map questions
    const questions = dto.questions.map((q) =>
      this.questionRepo.create({
        ...q,
        exam: savedExam,
        created_by: jwtPayload.id,
        created_user_name: `${jwtPayload.first_name} ${jwtPayload.last_name}`,
        created_at: new Date(),
      })
    );

    // ✅ Save all questions
    await this.questionRepo.save(questions);

    // ✅ Return exam + attached questions
    return this.examRepo.findOne({
      where: { id: savedExam.id },
      relations: ["questions"],
    });
  }

  async findAll(): Promise<ExamEntity[]> {
    return this.examRepo.find({ relations: ["questions"] });
  }

  async findOne(id: string): Promise<ExamEntity> {
    const exam = await this.examRepo.findOne({
      where: { id },
      relations: ["questions"],
    });
    if (!exam) throw new BadRequestException("Exam not found");
    return exam;
  }
}
