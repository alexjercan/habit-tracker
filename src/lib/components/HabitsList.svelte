<script lang="ts">
	import { collectionStore } from "sveltefire";
	import type { User } from "firebase/auth";
	import HabitsListElement from "./HabitsListElement.svelte";
	import {
		Firestore,
		doc,
		collection,
		setDoc,
		addDoc,
		deleteDoc,
		query,
		orderBy
	} from "firebase/firestore";

	export let user: User;
	export let firestore: Firestore;

	type Habit = {
		id: string;
		name: string;
	};

	async function handleKeyDown(event: KeyboardEvent, habit: any) {
		if (event.key === "Enter") {
			await setDoc(doc(firestore, "tracker", user.uid, "habits", habit.id), { name: habit.name });
		}
	}

	let newHabit = "";

	async function addNewHabit() {
		if (newHabit === "") return;
		const timestamp = Date.now();
		await addDoc(collection(firestore, "tracker", user.uid, "habits"), {
			name: newHabit,
			createdAt: timestamp
		});
		newHabit = "";
	}

	async function handleDelete(habit: any) {
		await deleteDoc(doc(firestore, "tracker", user.uid, "habits", habit.id));
	}

	const habitsRef = collection(firestore, "tracker", user.uid, "habits");
	const habitsQuery = query(habitsRef, orderBy("createdAt"));
	const habits = collectionStore<Habit>(firestore, habitsQuery);
</script>

<div class="flex flex-col space-y-4">
	<h2 class="text-5xl">Habits</h2>

	<ul class="list-none flex flex-col space-y-2">
		{#each $habits as habit}
			<li>
				<HabitsListElement
					value={habit.name}
					handleKeyDown={(event, name) => handleKeyDown(event, { id: habit.id, name })}
					handleDelete={() => handleDelete(habit)}
				/>
			</li>
		{/each}
	</ul>

	<form on:submit|preventDefault={addNewHabit}>
		<input
			type="text"
			bind:value={newHabit}
			placeholder="New Habit..."
			class="input input-ghost w-full max-w-xs text-xl"
		/>
	</form>
</div>

<style>
</style>
