import { Controller, Get, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AppService } from "./app.service";
import { firstValueFrom } from "rxjs";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('FILES_SERVICE') private readonly filesServiceClient: ClientProxy,
    //@Inject('PAYMENTS_SERVICE') private readonly paymentsServiceClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('get-file-data')
  async getFileData() {
    return await firstValueFrom(
      this.filesServiceClient.send({ cmd: 'get_file_data' }, {}),
    );
  }

  // @EventPattern('payment_successful')
  // handlePaymentSuccess(data: any) {
  //   console.log('Received payment success message:', data);
  // }
}
