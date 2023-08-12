<script lang="ts">
	import { SignedIn } from "sveltefire";
	import { firestore } from "$lib/firebase";
	import HabitTracker from "$lib/components/HabitTracker.svelte";
</script>

<SignedIn let:user>
	<HabitTracker {user} {firestore} />
</SignedIn>
