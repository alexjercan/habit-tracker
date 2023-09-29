<script>
	import { SignedIn } from "sveltefire";
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost normal-case text-5xl">Habit Tracker</a>
	</div>
	<div class="flex-none gap-2">
		<SignedIn let:user>
			{#if !user.isAnonymous }
				<div>
					<a href="/stats" class="btn btn-ghost">
						<div>
							<p>PRO</p>
						</div>
					</a>
				</div>
			{/if}
		</SignedIn>

		<div>
			<a href="/account" class="btn btn-ghost btn-circle avatar">
				<div class="w-10 rounded-full">
					<SignedIn let:user>
						<img src={user.photoURL || "/avatar.png"} alt="avatar" />
					</SignedIn>
				</div>
			</a>
		</div>
	</div>
</div>

<style>
</style>
