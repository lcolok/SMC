<template>
	<div>
		<v-menu
			bottom
			right
			content-class="dropdown-menu"
			offset-y
			transition="slide-y-transition"
			absolute
			v-bind="[$attrs]"
		>
			<v-list dense avatar>
				<v-list-item
					v-for="(item, i) in items"
					:key="i"
					@click="
						item.action({
							$event,
							$copyText,
							$store,
							$props,
							$attrs,
							attachmentURL,
							title,
							suffix,
						})
					"
				>
					<v-icon>{{ item.icon }}</v-icon>
					<v-list-item-title>{{ $t(item.text) }}</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
	</div>
</template>

<script>
import { Object } from 'leancloud-storage';
export default {
	// created() {
	// 	console.log(this);
	// },
	// watch: {
	// 	details(val) {
	// 		console.log(val);
	// 	},
	// },
	props: {
		items: {
			type: Array,
			required: true,
		},
		attachmentURL: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		suffix: {
			type: String,
			required: true,
		},
	},
	methods: {},
};
</script>

<style lang="scss" scoped></style>
