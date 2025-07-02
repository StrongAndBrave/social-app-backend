import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class FilesClientService {
	@Inject('FILES_SERVICE') private filesProxyClient: ClientProxy;

	async uploadFile(data: { userId: string; image: Buffer }) {
		try {
			return await this.filesProxyClient.send({ cmd: 'upload_image' }, data).toPromise();
		} catch (error) {
			console.error('something wrong with upload image: ', error);
			return null;
		}
	}

	async uploadAvatar(data: { userId: string; image: Buffer }) {
		try {
			return await this.filesProxyClient.send({ cmd: 'upload_avatar' }, data).toPromise();
		} catch (error) {
			console.error('something wrong with upload image: ', error);
			return null;
		}
	}

	async deleteFile(data: { filePath: string }) {
		try {
			return await this.filesProxyClient.send({ cmd: 'delete_image' }, data).toPromise();
		} catch (error) {
			console.error('something wrong with upload image: ', error);
			return null;
		}
	}

	async deleteAvatar(data: { filePath: string }) {
		try {
			return await this.filesProxyClient.send({ cmd: 'delete_avatar' }, data).toPromise();
		} catch (error) {
			console.error('something wrong with upload image: ', error);
			return null;
		}
	}
}
