<script lang="ts">
	import { User, collectionStore } from "sveltefire";
	import { collection, where, query, Firestore, DocumentReference } from "firebase/firestore";

	export let user: User;
	export let firestore: Firestore;

	const today = new Date();
	const formattedMonth = (today.getMonth() + 1).toString().padStart(2, "0");
	const month = `${today.getFullYear()}-${formattedMonth}`;

	type Daily = {
		id: string;
		done: DocumentReference[];
	};

	const dailyRef = collection(firestore, "tracker", user.uid, "daily");
	const q = query(dailyRef, where("month", "==", month));
	const daily = collectionStore<Daily>(firestore, q);

	type Habit = {
		id: string;
		name: string;
	};

	const habitsRef = collection(firestore, "tracker", user.uid, "habits");
	const habits = collectionStore<Habit>(firestore, habitsRef);
</script>

<h1>Tracker</h1>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th />
				{#each $habits as habit}
					<th>{habit.name}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each $daily as day}
				<tr>
					<th>{day.id}</th>
					{#each $habits as habit}
						{#if day.done.map((h) => h.id).includes(habit.id)}
							<td>Done</td>
						{:else}
							<td />
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
