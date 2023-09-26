<script lang="ts">
	import type { User } from "sveltefire";
	import {
        query,
		collection,
		orderBy,
        limit,
		getDocs,
		Firestore,
		DocumentReference
	} from "firebase/firestore";
	import { onMount } from "svelte";

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

	onMount(async () => {
		const Plotly = await import("plotly.js-dist");

		const habitsRef = collection(firestore, "tracker", user.uid, "habits");
		const habitsSnap = await getDocs(habitsRef);
		const habits = habitsSnap.docs.map((doc) => {
			return { id: doc.id, name: doc.data().name };
		}) as Habit[];

        const dailyRef = collection(firestore, "tracker", user.uid, "daily");
        const dailyQuery = query(dailyRef, orderBy("createdAt", "desc"), limit(60));
        const dailySnap = await getDocs(dailyQuery);
        const daily = dailySnap.docs.map((doc) => {
            return { id: doc.id, done: doc.data().done } as Daily;
        });

		const theta = habits.map((habit) => habit.name);
		const pastR = Array(habits.length).fill(0);
		const currR = Array(habits.length).fill(0);

        const currDaily = daily.slice(0, 30);
        const pastDaily = daily.slice(30, 60);

		for (let day of currDaily) {
            const done = day.done.map((h) => h.id);

			for (let i = 0; i < habits.length; i++) {
				if (done.includes(habits[i].id)) {
					currR[i]++;
				}
			}
		}

        for (let day of pastDaily) {
            const done = day.done.map((h) => h.id);

            for (let i = 0; i < habits.length; i++) {
                if (done.includes(habits[i].id)) {
                    pastR[i]++;
                }
            }
        }

		Plotly.newPlot(
			document.getElementById("polar"),
			[
				{
					type: "scatterpolar",
					r: pastR,
					theta: theta,
					fill: "toself",
					name: "Past 30 Days"
				},
				{
					type: "scatterpolar",
					r: currR,
					theta: theta,
					fill: "toself",
					name: "Current 30 Days"
				}
			],
			{
				polar: {
					radialaxis: {
						visible: true,
						range: [0, 30]
					}
				}
			}
		);
	});
</script>

<h1 class="text-3xl">Monthly Evolution</h1>
<div id="polar" />
