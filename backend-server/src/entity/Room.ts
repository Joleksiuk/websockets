import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";
import { User } from "./User";

@Entity()
@Unique(["id"])
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  name: string;

  @Column()
  @Length(4, 100)
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "ownerId" })
  owner: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: "room_authorized_users",
    joinColumn: { name: "roomId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
  authorizedUsers: User[];

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
