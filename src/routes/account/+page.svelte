<script lang="ts">
	import { SignedIn } from "sveltefire";

	import SignOut from "$lib/components/SignOut.svelte";
</script>

<SignedIn let:user>
	<h1>Account</h1>
	<p>Logged in as {user.displayName}</p>
	<SignOut />
</SignedIn>
