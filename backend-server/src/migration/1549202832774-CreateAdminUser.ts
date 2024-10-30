import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.username = "admin";
    user.password = "admin";
    user.hashPassword();
    user.role = "ADMIN";
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
