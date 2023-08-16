<script lang="ts">
	import { SignedIn } from "sveltefire";
	import { firestore } from "$lib/firebase";
	import HabitTracker from "$lib/components/HabitTracker.svelte";
</script>

<svelte:head>
	<title>Habit Tracker</title>
	<meta
		name="description"
        content="Dashboard that allows users to visualize and update the status
        of their daily habits."
	/>
</svelte:head>

<SignedIn let:user>
	<HabitTracker {user} {firestore} />
</SignedIn>
