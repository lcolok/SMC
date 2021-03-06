import txtsegment from '../../../../api/xunfei/txtsegment';

export default {
	speakersList: (state, getters) => {
		return state.speakersList;
	},
	currentSpeaker: (state, getters) => {
		if (state.tabIndex == null && state.slideIndex == null) {
			return null;
		}
		const cs = getters.speakersList[state.tabIndex].list[state.slideIndex];
		console.log(cs);
		if (cs) {
			// state.prevSpeaker = cs;
			return cs;
		} else {
			// return getters.speakersList[state.tabIndex].list[0];
			// return state.prevSpeaker;
			return null;
		}
	},
	volume: state => {
		function linear(t, tMin, tMax, minValue, maxValue) {
			let duration = tMax - tMin;
			let diff = maxValue - minValue;
			return (t / duration) * diff + minValue;
		}
		let volume = linear(state.volumeSlider, 0, 100, -20, 20);
		volume = Math.floor(volume);
		return (state.volume = volume);
	},
	speed: state => {
		return [-200, -100, 0, 100, 200][state.speedSlider];
	},
	totalWord: state => {
		let handledValue = state.content;
		[/\[0\.5秒\]/g, /\[1秒\]/g, /\[2秒\]/g, /\[=[a-z]{1,6}[1-4]\]/g].forEach(
			e => {
				handledValue = handledValue.replace(e, '');
			},
		);
		return (state.totalWord = handledValue.length);
	},
	afterSegment: state => {
		return txtsegment(state.content);
	},
	currentLineIndex: (state, getters) => {
		let progress = state.currentProgress;
		let scale = state.sliderScale;
		return Math.floor(progress / scale);
	},
	currentSentence: (state, getters) => {
		return getters.afterSegment[getters.currentLineIndex];
	},
	lineRate: (state, getters) => {
		let progress = state.currentProgress;
		let scale = state.sliderScale;
		// let rate = (progress - Math.floor(progress / scale) * scale) / scale;
		let rate = progress / scale - Math.floor(progress / scale);
		return rate;
	},
	sliderMax: (state, getters) => {
		return getters.afterSegment.length * state.sliderScale - 1;
	},
	queries: (state, getters) => {
		let currentSentence = getters.afterSegment[getters.currentLineIndex];
		console.log(currentSentence);
		let len = currentSentence.length;
		return currentSentence.substr(Math.floor(len * getters.lineRate), 1);
	},
};
