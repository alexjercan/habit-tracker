<script lang="ts">
	import { User, collectionStore, Doc } from "sveltefire";
	import { collection, Firestore, DocumentReference, doc, setDoc } from "firebase/firestore";

	export let user: User;
	export let firestore: Firestore;

	type Daily = {
		id: string;
		done: DocumentReference[];
	};

	type Habit = {
		id: string;
		name: string;
	};

	function formatDate(date: Date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	function generateDaysList(start: number, end: number) {
		const currentDate = new Date();
		const dateList = [];

		for (let i = start; i <= end; i++) {
			const targetDate = new Date();
			targetDate.setDate(currentDate.getDate() + i);
			dateList.push(formatDate(targetDate));
		}

		return dateList;
	}

	function checkHabit(data: Daily | null, habit: Habit): boolean {
		return data?.done?.map((h) => h.id)?.includes(habit.id) ?? false;
	}

	function completeHabit(day: string, data: Daily | null, habit: Habit) {
		setDoc(doc(firestore, `tracker/${user.uid}/daily/${day}`), {
			done: [...(data?.done ?? []), doc(firestore, `tracker/${user.uid}/habits/${habit.id}`)]
		});
	}

	function uncompleteHabit(day: string, data: Daily | null, habit: Habit) {
		setDoc(doc(firestore, `tracker/${user.uid}/daily/${day}`), {
			done: data?.done?.filter((h) => h.id !== habit.id) ?? []
		});
	}

	const daysBefore = generateDaysList(-7, -1);
	const daysAfter = generateDaysList(1, 7);
	const today = formatDate(new Date());

	const habitsRef = collection(firestore, "tracker", user.uid, "habits");
	const habits = collectionStore<Habit>(firestore, habitsRef);
</script>

<div class="w-full flex flex-col justify-around">
	{#each daysBefore as day, index}
		<div
			class="w-full flex flex-row justify-around"
			style="filter: blur({daysBefore.length - index}px);"
		>
			<div class="text-xl">{day}</div>
			{#each $habits as habit}
				<Doc ref={`tracker/${user.uid}/daily/${day}`} let:data>
					<div class="cell">
						{#if checkHabit(data, habit)}
							<input
								type="checkbox"
								checked
								class="checkbox checkbox-success checkbox-md"
								on:click={() => uncompleteHabit(day, data, habit)}
							/>
						{:else}
							<input
								type="checkbox"
								class="checkbox checkbox-success checkbox-md"
								on:click={() => completeHabit(day, data, habit)}
							/>
						{/if}
					</div>
				</Doc>
			{/each}
		</div>
	{/each}

	<div class="w-full flex flex-row justify-around">
		<div class="text-5xl flex justify-center items-center">Today</div>
		{#each $habits as habit}
			<Doc ref={`tracker/${user.uid}/daily/${today}`} let:data>
				<button
					class="flex flex-col justify-between items-center grow-0 basis-0"
					on:click={() =>
						checkHabit(data, habit)
							? uncompleteHabit(today, data, habit)
							: completeHabit(today, data, habit)}
				>
					<div class="text-2xl text-center">{habit.name}</div>
					<div class="">
						{#if checkHabit(data, habit)}
							<input
								type="checkbox"
								checked
								class="checkbox checkbox-success checkbox-lg"
							/>
						{:else}
							<input
								type="checkbox"
								class="checkbox checkbox-success checkbox-lg"
							/>
						{/if}
					</div>
				</button>
			</Doc>
		{/each}
	</div>

	{#each daysAfter as day, index}
		<div class="w-full flex flex-row justify-around" style="filter: blur({index + 1}px);">
			<div class="text-xl">{day}</div>
			{#each $habits as habit}
				<Doc ref={`tracker/${user.uid}/daily/${day}`} let:data>
					<div class="cell">
						{#if checkHabit(data, habit)}
							<input
								type="checkbox"
								checked
								class="checkbox checkbox-success checkbox-md"
								on:click={() => uncompleteHabit(day, data, habit)}
							/>
						{:else}
							<input
								type="checkbox"
								class="checkbox checkbox-success checkbox-md"
								on:click={() => completeHabit(day, data, habit)}
							/>
						{/if}
					</div>
				</Doc>
			{/each}
		</div>
	{/each}
</div>
