<script lang="ts">
	import { SignedIn, Doc } from "sveltefire";
	import { firestore } from "$lib/firebase";
	import HabitStats from "$lib/components/HabitStats.svelte";
	import Pro from "$lib/components/Pro.svelte";
	import { onMount } from "svelte";

	async function popConfetti() {
		const confetti = (await import("$lib/confetti")).default;
		confetti();
	}

	onMount(popConfetti);
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
	<Doc ref={`pro/${user.uid}`} let:data>
		{#if data}
			<HabitStats {user} {firestore} />
		{:else}
			<Pro {user} />
		{/if}
	</Doc>
</SignedIn>
