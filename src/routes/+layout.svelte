<script lang="ts">
	import { FirebaseApp, SignedOut } from "sveltefire";
	import "../app.css";

	import { auth, firestore } from "$lib/firebase";
	import GoogleSignin from "$lib/components/GoogleSignin.svelte";
	import AnonymousSignin from "$lib/components/AnonymousSignin.svelte";
	import Navbar from "$lib/components/Navbar.svelte";
</script>

<div class="flex flex-col w-screen h-screen">
	<FirebaseApp {auth} {firestore}>
		<Navbar />
		<main class="flex flex-col w-full h-full items-center justify-center">
			<slot />
			<div class="flex flex-col flex-grow items-center justify-around">
				<SignedOut>
					<div class="flex flex-col items-center justify-center">
						<h1 class="text-xl">Login</h1>
						<GoogleSignin />
						<AnonymousSignin />
					</div>
					<div>
						<p class="text-xl">
							You should check out this
							<a href="https://www.youtube.com/watch?v=Oy5THj0IJ8o">
								<span class="underline">
									<i> VIDEO </i>
								</span>
							</a>
							to learn how to use this app.
						</p>
						<p class="">
							If you have any questions, feel free to contact me at
							<a href="mailto:alexjercan19@gmail.com">
								<span class="underline">
									<i> alexjercan19@gmail.com </i>
								</span>
							</a>
						</p>
					</div>
				</SignedOut>
			</div>
		</main>
	</FirebaseApp>
</div>
