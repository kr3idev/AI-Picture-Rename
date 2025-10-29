export default class ImageTask {
	file: File;
	newName: string | null;
	isLoading: boolean;

	constructor(file: File, newName: string | null = null, isLoading: boolean = false) {
		this.file = file;
		this.newName = newName;
		this.isLoading = isLoading;
	}
}