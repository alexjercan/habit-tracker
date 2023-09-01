export function formatDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function generateDaysList(start: number, end: number) {
	const currentDate = new Date();
	const dateList: string[] = [];

	for (let i = start; i <= end; i++) {
		const targetDate = new Date();
		targetDate.setDate(currentDate.getDate() + i);
		dateList.push(formatDate(targetDate));
	}

	return dateList;
}
