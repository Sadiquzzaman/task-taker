import { Column, Entity, OneToMany } from "typeorm";
import { ExamQuestionEntity } from "./exam-question.entity";
import { CustomBaseEntity } from "src/common/common-entities/custom-base.enity";
import { IsNotEmpty } from "class-validator";

@Entity({ name: "exams" })
export class ExamEntity extends CustomBaseEntity {
    @Column({name:"exam_start_time", type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @IsNotEmpty()
    exam_start_time: Date;
  
    @Column({name:"exam_end_time", type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @IsNotEmpty()
    exam_end_time: Date;

    @Column({name:"is_negative_marking", type: 'boolean', default: false })
    @IsNotEmpty()
    is_negative_marking: boolean;
  
    @Column({name:"negative_mark_value", type: 'float', nullable: true })
    negative_mark_value: number;
  
    @Column({name:"subject", type: 'varchar', length: 100 })
    @IsNotEmpty()
    subject: string;

  @OneToMany(() => ExamQuestionEntity, (question) => question.exam, {
    cascade: true,
  })
  questions: ExamQuestionEntity[];
}
