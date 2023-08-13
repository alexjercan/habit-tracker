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

	function generateDaysList() {
		const currentDate = new Date();
		const dateList = [];

		for (let i = -7; i <= 7; i++) {
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

	const daysList = generateDaysList();
    const today = formatDate(new Date());

	const habitsRef = collection(firestore, "tracker", user.uid, "habits");
	const habits = collectionStore<Habit>(firestore, habitsRef);
</script>

<div class="w-full">
	<table class="table">
		<thead>
			<tr>
				<th />
				{#each $habits as habit}
					<th class="text-xl">{habit.name}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each daysList as day}
				<tr>
                    {#if day === today}
                    <th class="text-5xl">Today</th>
					{#each $habits as habit}
						<Doc ref={`tracker/${user.uid}/daily/${day}`} let:data>
							<td>
								{#if checkHabit(data, habit)}
									<input
										type="checkbox"
										checked
										class="checkbox checkbox-success checkbox-lg"
										on:click={() => uncompleteHabit(day, data, habit)}
									/>
								{:else}
									<input
										type="checkbox"
										class="checkbox checkbox-success checkbox-lg"
										on:click={() => completeHabit(day, data, habit)}
									/>
								{/if}
							</td>
						</Doc>
					{/each}
                    {:else}
					<th class="text-xl">{day}</th>
					{#each $habits as habit}
						<Doc ref={`tracker/${user.uid}/daily/${day}`} let:data>
							<td>
								{#if checkHabit(data, habit)}
									<input
										type="checkbox"
										checked
										class="checkbox checkbox-success"
										on:click={() => uncompleteHabit(day, data, habit)}
									/>
								{:else}
									<input
										type="checkbox"
										class="checkbox checkbox-success"
										on:click={() => completeHabit(day, data, habit)}
									/>
								{/if}
							</td>
						</Doc>
					{/each}
                    {/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
