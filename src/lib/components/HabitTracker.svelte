<script lang="ts">
	import { User, collectionStore, Doc } from "sveltefire";
	import {
		collection,
		Firestore,
		DocumentReference,
		doc,
		setDoc,
		query,
		orderBy,
	} from "firebase/firestore";
	import { formatDate, generateDaysList } from "../date";
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

	function checkHabit(data: Daily | null, habit: Habit): boolean {
		return data?.done?.map((h) => h.id)?.includes(habit.id) ?? false;
	}

	function completeHabit(day: string, data: Daily | null, habit: Habit) {
        const dateTimestamp = new Date(day);

		setDoc(doc(firestore, `tracker/${user.uid}/daily/${day}`), {
			done: [...(data?.done ?? []), doc(firestore, `tracker/${user.uid}/habits/${habit.id}`)],
            createdAt: dateTimestamp
		});
	}

	function uncompleteHabit(day: string, data: Daily | null, habit: Habit) {
        const dateTimestamp = new Date(day);

		setDoc(doc(firestore, `tracker/${user.uid}/daily/${day}`), {
			done: data?.done?.filter((h) => h.id !== habit.id) ?? [],
            createdAt: dateTimestamp
		});
	}

	const daysBefore = generateDaysList(-7, -1);
	const daysAfter = generateDaysList(1, 7);
	const today = formatDate(new Date());

	const habitsRef = collection(firestore, "tracker", user.uid, "habits");
	const habitsQuery = query(habitsRef, orderBy("createdAt"));
	const habits = collectionStore<Habit>(firestore, habitsQuery);
</script>

<div class="w-full h-full flex flex-col justify-between items-center elcontainer">
	{#each daysBefore as day, index}
		<div
			class="w-full flex flex-row justify-between items-center element"
			style="--i: {index + 1}; --j: {daysBefore.length - index}; "
		>
			<div>{day}</div>
			<Doc ref={`tracker/${user.uid}/daily/${day}`} let:data>
				{#each $habits as habit}
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
				{/each}
			</Doc>
		</div>
	{/each}

	<div class="w-full flex flex-row justify-between current">
		<div class="flex justify-center items-center">Today</div>
		<Doc ref={`tracker/${user.uid}/daily/${today}`} let:data>
			{#each $habits as habit}
				<button
					class="flex flex-col justify-between items-center grow-0 basis-0"
					on:click={() =>
						checkHabit(data, habit)
							? uncompleteHabit(today, data, habit)
							: completeHabit(today, data, habit)}
				>
					<div class="text-center current_text">{habit.name}</div>
					<div>
						{#if checkHabit(data, habit)}
							<Checkmark />
						{:else}
							<Xmark />
						{/if}
					</div>
				</button>
			{/each}
		</Doc>
	</div>

	{#each daysAfter as day, index}
		<div
			class="w-full flex flex-row justify-between items-center element"
			style="--j: {index + 1}; --i: {daysBefore.length - index}; "
		>
			<div>{day}</div>
			<Doc ref={`tracker/${user.uid}/daily/${day}`} let:data>
				{#each $habits as habit}
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
				{/each}
			</Doc>
		</div>
	{/each}
</div>

<style lang="postcss">
	.elcontainer {
		padding-left: 3rem;
		padding-right: 3rem;
	}

	.element {
		font-size: calc(var(--i) * 0.25rem);
		padding-top: calc(var(--i) * 0.1rem);
		padding-bottom: calc(var(--i) * 0.1rem);
		filter: blur(calc(var(--j) * 1px));
		padding-left: calc(var(--j) * 1rem);
		padding-right: calc(var(--j) * 1rem);
	}

	.current {
		font-size: 4rem;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}

	.current_text {
		font-size: 2rem;
	}

	@media (max-width: 768px) {
		.elcontainer {
			padding-left: 1rem;
			padding-right: 1rem;
		}

		.element {
			font-size: calc(var(--i) * 0.1rem);
			padding-top: 0;
			padding-bottom: 0;
			filter: blur(calc(var(--j) * 1px));
			padding-left: calc(var(--j) * 1rem);
			padding-right: calc(var(--j) * 1rem);
		}

		.current {
			font-size: 2rem;
			padding-top: 1rem;
			padding-bottom: 1rem;
		}

		.current_text {
			font-size: 1rem;
		}
	}
</style>
