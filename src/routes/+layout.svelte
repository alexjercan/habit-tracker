<script lang="ts">
	import { FirebaseApp, SignedIn, SignedOut } from "sveltefire";

	import { auth, firestore } from "$lib/firebase";
	import GoogleSignin from "$lib/components/GoogleSignin.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
</script>

<FirebaseApp {auth} {firestore}>
	<SignedIn>
		<Navbar />
		<main>
			<slot />
		</main>
	</SignedIn>

	<SignedOut>
		<h1>Login</h1>
		<GoogleSignin />
		<p class="footer">By signing up, you agree to the Terms of Service & Privacy Policy.</p>
	</SignedOut>
</FirebaseApp>
