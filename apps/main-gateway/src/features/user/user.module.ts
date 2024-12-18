import { Module } from "@nestjs/common";
import { UserRepository } from "./infrastructure/user.repository";
import { UserCreateUseCase } from "./application/use-cases/user.create.use-case";

@Module({
  providers: [
    {
      provide: UserRepository.name,
      useClass: UserRepository
    },
    UserCreateUseCase,
  ],

  exports: [UserRepository.name, UserCreateUseCase]
})
export class UserModule {
}