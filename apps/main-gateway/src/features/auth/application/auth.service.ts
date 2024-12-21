import { Inject, Injectable } from "@nestjs/common";
import bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { v4 as uuidv4 } from 'uuid';
import { add } from "date-fns";
import { UserRepository } from "../../user/infrastructure/user.repository";
import { AuthConfig } from "../auth.config";
import { SessionRepository } from "../../session/infrastructure/session.repository";
import { MailService } from "../../../core/adapters/mailer/mail.service";
import { UnauthorizedDomainException } from "../../../core/exceptions/domain-exceptions";


@Injectable()
export class AuthService {
   constructor(
      @Inject(UserRepository.name) protected readonly userRepository: UserRepository,
      protected readonly jwtService: JwtService,
      @Inject(MailService.name) private readonly mailService: MailService,
      @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository,
      @Inject(AuthConfig.name) private readonly authConfig: AuthConfig
   ) { }

   async resendEmail(email: string): Promise<boolean | null> {
      const token = uuidv4();
      try {
         const user =
            await this.userRepository.getByUnique(
               {email: email}
            );
         if (!user) return null;
         if (user.isConfirmed != false) return false;

         const date = add(new Date(), {
				hours: 1,
			})

         await this.userRepository.update({ where: { id: user.id }, data: { confirmationCode: token, codeExpirationDate: date } })

         await this.mailService.sendUserConfirmation(user.email, user.username, token)
         return true

      } catch (error) {
         console.log(error);
         return false;
      }
   }

   async validateUser(loginOrEmail: string, password: string): Promise<string> {
      const user = await this.userRepository.getByUsernameOrEmail(loginOrEmail);
      if (!user) throw UnauthorizedDomainException.create('User or password not valid');

      const isPasswordEquals = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordEquals) throw UnauthorizedDomainException.create('User or password not valid');
      return user.id
   }

   async generateTokens(userId: string, deviceId: string, issuedAt: string): Promise<{
      accessToken: string;
      refreshToken: string;
   }> {

      const accessToken = await this.jwtService.signAsync({
         userId
      }, {
         expiresIn: this.authConfig.accessExpiresIn,
         secret: this.authConfig.secretAccess
      });
      const refreshToken = await this.jwtService.signAsync({
         userId,
         deviceId,
         issuedAt
      }, {
         expiresIn: this.authConfig.refreshExpiresIn,
         secret: this.authConfig.secretRefresh
      })
      
      return {
         accessToken: accessToken,
         refreshToken: refreshToken
      }
   }

   async sessionIsValid(deviceId: string, issuedAt: string): Promise<boolean> {
      const session = await this.sessionRepository.getByUnique({id: deviceId});
      if (!session) return false;
      if (session.id !== deviceId) return false;
      // Check version as issued at
      if (issuedAt !== session.updatedAt.toISOString()) return false;
      return true
   }

   async generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
} 

