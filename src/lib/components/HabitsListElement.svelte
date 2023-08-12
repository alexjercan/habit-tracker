<script lang="ts">
    export let value: string;
    export let handleKeyDown: (event: KeyboardEvent, value: string) => void;
    export let handleDelete: () => void;
</script>

<input type="text" bind:value={value} on:keydown={(event) => handleKeyDown(event, value)} />
<button on:click={handleDelete}>Delete</button>

<style>
</style>
