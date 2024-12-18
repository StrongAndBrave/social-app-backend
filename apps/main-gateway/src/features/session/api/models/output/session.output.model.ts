export interface SessionOutputModel {
	current: Session;
	others: Array<Session>;
}

export interface Session {
	deviceName: string;
	ip: string;
	lastVisit: string;
}
