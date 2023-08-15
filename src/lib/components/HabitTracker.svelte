<script lang="ts">
	import { User, collectionStore, Doc } from "sveltefire";
	import {
		collection,
		Firestore,
		DocumentReference,
		doc,
		setDoc,
		query,
		orderBy
	} from "firebase/firestore";
	import Checkmark from "./Checkmark.svelte";
	import Xmark from "./Xmark.svelte";

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
	const habitsQuery = query(habitsRef, orderBy("createdAt"));
	const habits = collectionStore<Habit>(firestore, habitsQuery);
</script>

<div class="w-full flex flex-col justify-around">
	{#each daysBefore as day, index}
		<div
			class="w-full flex flex-row justify-around"
			style="filter: blur({daysBefore.length - index}px); font-size: {(index + 1) *
				0.25}rem; padding-left: {daysBefore.length - index}rem; padding-right: {daysBefore.length -
				index}rem; padding-top: {(index + 1) * 0.1}rem; padding-bottom: {(index + 1) * 0.1}rem;"
		>
			<div>{day}</div>
			{#each $habits as habit}
				<Doc ref={`tracker/${user.uid}/daily/${day}`} let:data>
					<button
						on:click={() =>
							checkHabit(data, habit)
								? uncompleteHabit(day, data, habit)
								: completeHabit(day, data, habit)}
					>
						{#if checkHabit(data, habit)}
							<Checkmark />
						{:else}
							<Xmark />
						{/if}
					</button>
				</Doc>
			{/each}
		</div>
	{/each}

	<div class="w-full flex flex-row justify-around" style="font-size: 4rem;">
		<div class="flex justify-center items-center">Today</div>
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
					<div>
						{#if checkHabit(data, habit)}
							<Checkmark />
						{:else}
							<Xmark />
						{/if}
					</div>
				</button>
			</Doc>
		{/each}
	</div>

	{#each daysAfter as day, index}
		<div
			class="w-full flex flex-row justify-around"
			style="filter: blur({index + 1}px); font-size: {(daysBefore.length - index) *
				0.25}rem; padding-left: {index + 1}rem; padding-right: {index +
				1}rem; padding-left: {index + 1}rem; padding-top: {(daysBefore.length - index) *
				0.1}rem; padding-bottom: {(daysBefore.length - index) * 0.1}rem;"
		>
			<div>{day}</div>
			{#each $habits as habit}
				<Doc ref={`tracker/${user.uid}/daily/${day}`} let:data>
					<button
						on:click={() =>
							checkHabit(data, habit)
								? uncompleteHabit(day, data, habit)
								: completeHabit(day, data, habit)}
					>
						{#if checkHabit(data, habit)}
							<Checkmark />
						{:else}
							<Xmark />
						{/if}
					</button>
				</Doc>
			{/each}
		</div>
	{/each}
</div>
