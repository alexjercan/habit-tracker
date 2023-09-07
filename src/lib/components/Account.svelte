<script lang="ts">
	import type { Firestore } from "firebase/firestore";
	import { firebaseSignOut } from "$lib/firebase";
	import type { User } from "firebase/auth";
	import HabitsList from "./HabitsList.svelte";
	import Pro from "./Pro.svelte";
	import { Doc } from "sveltefire";

	export let user: User;
	export let firestore: Firestore;
</script>

<div class="flex flex-col justify-between w-full h-full items-center">
	<HabitsList {user} {firestore} />

	<div class="flex flex-col justify-center items-center">
		<p>Logged in as {user.displayName || "Guest"}</p>

		<Doc ref={`pro/${user.uid}`} let:data>
			{#if !data}
				<Pro {user} />
			{/if}
		</Doc>

		<button on:click={firebaseSignOut} class="btn w-full"> SignOut </button>
	</div>
</div>

<style>
</style>
