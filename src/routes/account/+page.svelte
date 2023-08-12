<script lang="ts">
	import { SignedIn, Doc, Collection } from 'sveltefire';

	import SignOut from '$lib/components/SignOut.svelte';
</script>

<SignedIn let:user>
	<h1>Account</h1>
	<p>Logged in as {user.displayName}</p>

	<Doc ref={`tracker/${user.uid}`} let:ref>
		<h2>Habits</h2>

        <Collection ref={ref?.path + "/habits"} let:data={habits}>
            <ul>
                {#each habits as habit}
                    <li>{habit.name}</li>
                {/each}
            </ul>
        </Collection>
	</Doc>

	<SignOut />
</SignedIn>
