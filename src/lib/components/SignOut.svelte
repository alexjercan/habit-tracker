<script>
	import { firebaseSignOut } from "$lib/firebase";
</script>

<button on:click={firebaseSignOut}> SignOut </button>

<style>
	button {
		@apply bg-white font-sans text-base text-black inline-flex shadow-md px-4 py-3 my-0.5 w-full cursor-pointer border-none;
	}
</style>
