<script lang="ts">
	import type { User } from "firebase/auth";
	import { PUBLIC_APPLICATION_MODE } from "$env/static/public";

	export let user: User;
</script>

<div class="flex flex-col justify-center items-center space-y-4">
	<script async src="https://js.stripe.com/v3/buy-button.js">
	</script>

    <p class="text-xl">Buy Pro to view stats of your progress for $1.99</p>

	{#if PUBLIC_APPLICATION_MODE === "prod"}
		<stripe-buy-button
			buy-button-id="buy_btn_1NnaNuLdGV256uVaFVzubmFk"
			publishable-key="pk_live_51NnaIiLdGV256uVaTJIcpFLvYztuMXFtP5RsU8BsBUO1IIyGuuwj0YLWh8cswp13cE5VtEg8byFUBHvg58NwiEPv00JQ3HZ9M7"
			client-reference-id={user.uid}
		/>
	{:else}
		<stripe-buy-button
			buy-button-id="buy_btn_1NnaZiLdGV256uVayB8ffIYo"
			publishable-key="pk_test_51NnaIiLdGV256uVaHCdxNudMY2bSxRAHLNXBGZZH50j5VVuhBjwrWU2l6TO5Ffp43KyFloKXbN96VOH2lZIKzZFb00b7B7RpXv"
			client-reference-id={user.uid}
		/>
	{/if}
</div>

<style>
</style>
