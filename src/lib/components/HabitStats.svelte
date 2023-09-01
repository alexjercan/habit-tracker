<script lang="ts">
	import type { User } from "sveltefire";
	import {
		doc,
		collection,
		getDoc,
		getDocs,
		Firestore,
		DocumentReference
	} from "firebase/firestore";
	import { generateDaysList } from "../date";
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

	function checkHabit(data: Daily | null, habit: Habit): boolean {
		return data?.done?.map((h) => h.id)?.includes(habit.id) ?? false;
	}

	const pastDays = generateDaysList(-61, -31);
	const currDays = generateDaysList(-30, 0);

	onMount(async () => {
		const Plotly = await import("plotly.js-dist");

		const habitsRef = collection(firestore, "tracker", user.uid, "habits");
		const habitsSnap = await getDocs(habitsRef);
		const habits = habitsSnap.docs.map((doc) => {
			return { id: doc.id, name: doc.data().name };
		}) as Habit[];

		const theta = habits.map((habit) => habit.name);
		const pastR = Array(habits.length).fill(0);
		const currR = Array(habits.length).fill(0);

		for (let day of pastDays) {
			const dailyRef = doc(firestore, "tracker", user.uid, "daily", day);
			const dailySnap = await getDoc(dailyRef);
			const daily = dailySnap.data() as Daily;

			for (let i = 0; i < habits.length; i++) {
				if (checkHabit(daily, habits[i])) {
					pastR[i]++;
				}
			}
		}

		for (let day of currDays) {
			const dailyRef = doc(firestore, "tracker", user.uid, "daily", day);
			const dailySnap = await getDoc(dailyRef);
			const daily = dailySnap.data() as Daily;

			for (let i = 0; i < habits.length; i++) {
				if (checkHabit(daily, habits[i])) {
					currR[i]++;
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
