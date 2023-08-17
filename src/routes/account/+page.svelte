<script lang="ts">
	import { SignedIn } from "sveltefire";
	import Account from "$lib/components/Account.svelte";
	import { firestore } from "$lib/firebase";
</script>

<svelte:head>
	<title>Account</title>
	<meta
		name="description"
		content="Page that allows user to manage their accounts. This page lets
        users add, edit, and delete daily habits."
	/>
</svelte:head>

<SignedIn let:user>
	<Account {user} {firestore} />
</SignedIn>
