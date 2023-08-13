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

	function generateDaysList() {
		const currentDate = new Date();
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const daysList = [];
		for (let day = 1; day <= daysInMonth; day++) {
			const formattedDay = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
				.toString()
				.padStart(2, "0")}`;
			daysList.push(formattedDay);
		}

		return daysList;
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
				</tr>
			{/each}
		</tbody>
	</table>
</div>
