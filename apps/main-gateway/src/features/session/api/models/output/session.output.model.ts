export interface SessionOutputModel {
	current: Session;
	others: Array<Session>;
}

export class Session {
	@ApiProperty({ description: 'Name of the device', })
	deviceName: string;

	@ApiProperty({ description: 'IP address of the device' })
	ip: string;

	@ApiProperty({ description: 'Last visit timestamp',
		required: true,
	 })
	lastVisit: string;
}

export class SessionOutputModel {
	@ApiProperty({
		required: true,
		description: 'Current user session',
		type: () => Session,
	})
	current: Session;

	@ApiProperty({ type: [Session], description: 'Other user sessions' })
	others: Array<Session>;
}