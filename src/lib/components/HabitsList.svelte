<script lang="ts">
	import { Doc, Collection } from 'sveltefire';
	import type { User } from 'firebase/auth';
	import HabitsListElement from './HabitsListElement.svelte';
	import { Firestore, doc, collection, setDoc, addDoc, deleteDoc } from 'firebase/firestore';

	export let user: User;
	export let firestore: Firestore;

	async function handleKeyDown(event: KeyboardEvent, habit: any) {
		if (event.key === 'Enter') {
			await setDoc(doc(firestore, 'tracker', user.uid, 'habits', habit.id), { name: habit.name });
		}
	}

    let newHabit = "";

    async function addNewHabit() {
        if (newHabit === "") return;
        await addDoc(collection(firestore, 'tracker', user.uid, 'habits'), { name: newHabit });
        newHabit = "";
    }

    async function handleDelete(habit: any) {
        await deleteDoc(doc(firestore, 'tracker', user.uid, 'habits', habit.id));
    }
</script>

<Doc ref={`tracker/${user.uid}`} let:ref>
	<h2>Habits</h2>

	<Collection ref={ref?.path + '/habits'} let:data={habits}>
		<ul>
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
    <input type="text" bind:value={newHabit} placeholder="New Habit..."/>
</form>

<style>
</style>
