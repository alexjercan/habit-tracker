<script lang="ts">
	import { Doc, Collection } from "sveltefire";
	import type { User } from "firebase/auth";
	import HabitsListElement from "./HabitsListElement.svelte";
	import { Firestore, doc, collection, setDoc, addDoc, deleteDoc } from "firebase/firestore";

	export let user: User;
	export let firestore: Firestore;

	async function handleKeyDown(event: KeyboardEvent, habit: any) {
		if (event.key === "Enter") {
			await setDoc(doc(firestore, "tracker", user.uid, "habits", habit.id), { name: habit.name });
		}
	}

	let newHabit = "";

	async function addNewHabit() {
		if (newHabit === "") return;
		await addDoc(collection(firestore, "tracker", user.uid, "habits"), { name: newHabit });
		newHabit = "";
	}

	async function handleDelete(habit: any) {
		await deleteDoc(doc(firestore, "tracker", user.uid, "habits", habit.id));
	}
</script>

<div class="flex flex-col space-y-4">
	<Doc ref={`tracker/${user.uid}`} let:ref>
		<h2 class="text-5xl">Habits</h2>

		<Collection ref={ref?.path + "/habits"} let:data={habits}>
			<ul class="list-none flex flex-col space-y-2">
				{#each habits as habit}
					<li>
						<HabitsListElement
							value={habit.name}
							handleKeyDown={(event, name) => handleKeyDown(event, { id: habit.id, name })}
							handleDelete={() => handleDelete(habit)}
						/>
					</li>
				{/each}
			</ul>
		</Collection>
	</Doc>

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
