import { Controller, Get } from "@nestjs/common";
import { FilesService } from './files.service';
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  getHello(): string {
    return this.filesService.getHello();
  }

  @MessagePattern({cmd: 'get_file_data'})
  getFileData(): string {
    return this.filesService.getFileData()
  }
}
