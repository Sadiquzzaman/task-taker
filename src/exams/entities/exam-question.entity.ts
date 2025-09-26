import { IsNotEmpty, IsString, MaxLength, IsEnum } from 'class-validator';
import { CustomBaseEntity } from 'src/common/common-entities/custom-base.enity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ExamEntity } from './exam.entity';

export enum CorrectAnswerEnum {
  OPTION_1 = 'Option 1',
  OPTION_2 = 'Option 2',
  OPTION_3 = 'Option 3',
  OPTION_4 = 'Option 4',
}

@Entity('exam_questions')
export class ExamQuestionEntity extends CustomBaseEntity {
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  question: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  option1: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  option2: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  option3: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  option4: string;

  @Column({ type: 'enum', enum: CorrectAnswerEnum })
  @IsNotEmpty()
  @IsEnum(CorrectAnswerEnum)
  correct_answer: CorrectAnswerEnum;

  @Column({ type: 'text', nullable: true })
  explanation?: string;

  // Link to parent Exam
  @ManyToOne(() => ExamEntity, (exam) => exam.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exam_id' })
  exam: ExamEntity;
}
