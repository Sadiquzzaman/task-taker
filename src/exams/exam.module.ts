import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamQuestionEntity } from './entities/exam-question.entity';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { ExamEntity } from './entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamQuestionEntity,ExamEntity])],
  controllers: [ExamController],
  providers: [ExamService],
  exports: [ExamService],
})
export class ExamModule {}
