import { Exclude } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import { CustomBaseEntity } from "src/common/common-entities/custom-base.enity";
import { RolesEnum } from "src/common/enums/roles.enum";
import {
  Column,
  Entity,
  Index
} from "typeorm";

@Entity("users")
export class UserEntity extends CustomBaseEntity {
  @Column({ name: "first_name", type: "varchar", length: "50" })
  @IsNotEmpty()
  first_name: string;

  @Column({ name: "last_name", type: "varchar", length: "50" })
  @IsNotEmpty()
  last_name: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  @Index({ unique: true })
  @IsEmail()
  email: string;

  @Column({
    type: "varchar",
    name: "password",
    length: 100,
  })
  @Exclude()
  password: string;

  @Column({
    type: "varchar",
    name: "phone",
    length: 15,
    nullable: true,
  })
  @Index({ unique: true })
  phone: string;

  @Column({
    type: "boolean",
    name: "is_verified",
    default: true,
  })
  is_verified: boolean;

  @Column({
    type: "enum",
    enum: RolesEnum,
    default: RolesEnum.STUDENT,
  })
  role: RolesEnum;

  @Column({
    type: "varchar",
    name: "refresh_token",
    length: 1000,
    nullable: true,
  })
  @Index({ unique: true })
  refresh_token: string;

  @Column({
    type: "varchar",
    name: "reset_password_token",
    length: 1000,
    nullable: true,
  })
  @Index({ unique: true })
  reset_password_token: string;
}
