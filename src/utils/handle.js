export function cutHTTP(input) {
	return input.replace(/[a-zA-z]+:\/\//g, '');
}

export function renderSize(value) {
	if (null == value || value == '') {
		return '0 Bytes';
	}
	var unitArr = new Array(
		'Bytes',
		'KB',
		'MB',
		'GB',
		'TB',
		'PB',
		'EB',
		'ZB',
		'YB',
	);
	var index = 0,
		srcsize = parseFloat(value);
	index = Math.floor(Math.log(srcsize) / Math.log(1024));
	var size = srcsize / Math.pow(1024, index);
	//  保留的小数位数
	size = size.toFixed(2);
	return `${size} ${unitArr[index]}`;
}
