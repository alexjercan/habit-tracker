<script lang="ts">
	import { FirebaseApp, SignedOut } from "sveltefire";
	import "../app.css";

	import { auth, firestore } from "$lib/firebase";
	import GoogleSignin from "$lib/components/GoogleSignin.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
</script>

<div class="flex flex-col w-screen h-screen">
	<FirebaseApp {auth} {firestore}>
		<Navbar />
		<main class="flex w-full h-full">
			<slot />
			<div>
				<SignedOut>
					<h1 class="text-xl">Login</h1>
					<GoogleSignin />
					<p class="footer">By signing up, you agree to the Terms of Service & Privacy Policy.</p>
				</SignedOut>
			</div>
		</main>
	</FirebaseApp>
</div>
