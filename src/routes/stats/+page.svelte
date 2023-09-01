<script lang="ts">
	import { SignedIn } from "sveltefire";
	import { firestore } from "$lib/firebase";
	import HabitStats from "$lib/components/HabitStats.svelte";
</script>

<svelte:head>
	<title>Habit Statistics</title>
	<meta
		name="description"
		content="Dashboard that allows users to visualize statistics of their
        daily habits."
	/>
</svelte:head>

<SignedIn let:user>
	<HabitStats {user} {firestore} />
</SignedIn>
