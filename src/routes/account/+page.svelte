<script lang="ts">
	import { SignedIn } from "sveltefire";
	import Account from "$lib/components/Account.svelte";
	import { firestore } from "$lib/firebase";
</script>

<SignedIn let:user>
	<Account {user} {firestore} />
</SignedIn>
