<template>
	<v-card outlined tile class="ma-2 pa-2 grey lighten-5">
		<tts-lyric />
		<!-- <tts-rich-text /> -->
		<v-row align="center" class="ma-0 pa-0">
			<aplayer
				:audio="{
					name: currentSpeaker.speaker_name,
					artist: currentSpeaker.speaker_name,
					url: $store.state.tts.currentPlayUrl,
					cover: (currentSpeaker.img_url) // prettier-ignore
				}"
				mini
				ref="aplayer"
				loop="none"
				@ended="currentLineIndex++"
			/>

			<v-slider
				v-model="currentProgress"
				:min="0"
				:max="sliderMax"
				dense
				hide-details
			></v-slider>
			<v-btn color="primary" @click="sumbit">提交订单</v-btn>
		</v-row>

		<!-- <text-highlight :queries="queries">{{ content }}</text-highlight> -->

		<!-- <v-btn color="primary" @click="load">试听</v-btn> -->
	</v-card>
</template>

<script>
import AV from 'leancloud-storage';

import { mapGetters, mapState } from 'vuex';
import TextHighlight from 'vue-text-highlight';
export default {
	components: {
		TextHighlight,
	},
	mounted() {
		this.load();
	},
	watch: {
		currentSpeaker(val) {
			this.load();
		},
		currentLineIndex(val) {
			this.load();
		},
	},
	computed: {
		// audio() {
		// 	return {
		// 		name: this.currentSpeaker.speaker_name,
		// 		artist: this.currentSpeaker.speaker_name,
		// 		url: this.currentPlayUrl,
		// 		cover: this.toHttps(this.currentSpeaker.img_url) // prettier-ignore
		// 	};
		// },
		...mapState('tts', ['content', 'te']),
		...mapGetters('tts', [
			'afterSegment',
			'sliderMax',
			'queries',
			'currentSentence',
			'currentLineIndex',
			'currentSpeaker',
			'speed',
			'volume',
		]),
		// lyric() {
		// 	const obj = {};
		// 	this.afterSegment.map((e, index) => {
		// 		obj[index] = e;
		// 	});
		// 	console.log(obj);
		// 	return obj;
		// },
		currentProgress: {
			get() {
				return this.$store.state.tts.currentProgress;
			},
			set(val) {
				this.$store.state.tts.currentProgress = val;
			},
		},
		currentPlayUrl: {
			get() {
				return this.$store.state.tts.currentPlayUrl;
			},
			set(val) {
				this.$store.state.tts.currentPlayUrl = val;
			},
		},
	},
	methods: {
		sumbit() {
			const payload = {
				te: this.te,
				text: this.content,
				vid: this.currentSpeaker.speaker_no,
				volume: this.volume,
				speed: this.speed,
			};

			this.$cloud.api('tts_synthesis', payload).then(resp => {
				// window.open(resp);
				let url;

				let attname = `TTS_${new Date().toLocaleTimeString()}.mp3`;
				if (resp.includes('tmp')) {
					url = `/tts/sythesis?attname=${encodeURI(attname)}&path=${encodeURI(
						resp,
					)}`;
					if (window.location.href.includes('localhost')) {
						url = 'http://localhost:3000' + url;
					} else {
						url = 'https://smc.wiki' + url;
					}
				} else if (resp.includes('attachment')) {
					url = `${resp}?download&attname=${attname}`;
				}

				window.open(url);
			});
		},
		toHttps(u) {
			const url = new URL(u);
			url.protocol = 'https';
			return url.toString();
		},
		load() {
			// console.log(this.currentSentence);
			// console.log(this.currentSpeaker.speaker_no);
			// console.log(this.te);

			// var md5 = crypto.createHash('md5');
			// var message = 'hello';
			// var digest = md5.update(message, 'utf8').digest('hex');
			// console.log(digest);

			const payload = {
				te: this.te,
				text: this.currentSentence,
				vid: this.currentSpeaker.speaker_no,
				volume: this.volume,
				speed: this.speed,
			};
			console.log(payload);
			this.$cloud.api('tts_playTemp', payload).then(resp => {
				let url;
				if (!resp.match('attachments-cdn')) {
					url = '/tts/temp?n=' + resp;

					if (window.location.href.includes('localhost')) {
						url = 'http://localhost:3000' + url;
					} else {
						url = 'https://smc.wiki' + url;
					}
				} else {
					url = resp;
				}
				url += '#' + new Date().getTime();
				this.$store.state.tts.currentPlayUrl = url;
				console.log(url);
				// setTimeout(() => {
				// 	this.$refs.aplayer.play();
				// }, 0);
			});
		},
	},
	// props: {
	// 	speaker: {
	// 		type: Object,
	// 		required: true,
	// 	},
	// },
	data: () => ({
		// queries: ['birds', 'scatt'],
		// description: 'Tropical birds scattered as Drake veered the Jeep',
	}),
};
</script>
