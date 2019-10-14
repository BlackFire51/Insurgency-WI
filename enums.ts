
export enum ServerStatus{
	Stoped=0, 
	Running=1, 
	Crashed=2, 
	ShutingDown=3,
	Updating=4

}
export enum ServerStatusInternal{
	None=0, 
	AutoRestart=1, 
	AutoUpdate=2
}