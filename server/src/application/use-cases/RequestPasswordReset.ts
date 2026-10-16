import { inject, injectable } from "inversify";
import { TYPES } from "@/shared/types";
import type { IUserRepository } from "@/domain/repositories/IUserRepository";
import type { IOtpService } from "@/domain/services/IOtpService";
import type { IMailService } from "@/domain/services/IMailService";
import type { IRequestPasswordReset } from "@/domain/use-cases/IRequestPasswordReset";

@injectable()
export class RequestPasswordReset implements IRequestPasswordReset {
  constructor(
    @inject(TYPES.IUserRepository) private userRepo: IUserRepository,
    @inject(TYPES.IOtpService) private otpService: IOtpService,
    @inject(TYPES.IMailService) private mailService: IMailService,
  ) {}

  async execute({ identifier }: { identifier: string }): Promise<void> {
    const user = await this.userRepo.findByIdentifier(identifier.trim());
    if (!user || !user.isActive()) return;
    const email = user.getEmail();
    const code = await this.otpService.generate(email);
    await this.mailService.sendPasswordReset(email, code);
  }
}
