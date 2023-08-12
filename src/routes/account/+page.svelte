<script lang="ts">
	import { SignedIn } from 'sveltefire';

	import SignOut from '$lib/components/SignOut.svelte';
    import HabitsList from '$lib/components/HabitsList.svelte';
    import { firestore } from '$lib/firebase';
</script>

<SignedIn let:user>
	<h1>Account</h1>
	<p>Logged in as {user.displayName}</p>

    <HabitsList {user} {firestore} />

	<SignOut />
</SignedIn>
