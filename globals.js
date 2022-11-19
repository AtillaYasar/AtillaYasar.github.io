// returns current date as a [yy, mm, dd] array
function get_date(){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	var yy = yyyy-2000;
	return [parseInt(yy), parseInt(mm), parseInt(dd)];
}

function construct_date_string(date_array) {
	let sep = '-';
	return 'y' + date_array[0] + sep + 'm' + date_array[1] + sep + 'd' + date_array[2];
}

var dynamic_lifespan = true;
var lifespan_months = 6;
var outdated_before = [22, 6, 9];
var show_outdated = false;
var warning_color = 'red';

if (dynamic_lifespan) {
	var today = get_date();
	console.log(today);
	today[1] = today[1] - lifespan_months;
	
	// fix negative month  (weirdness because months start counting at 1)
	if (today[1] == 0) {
		console.log(today);
		today[0] = today[0] - 1;
		today[1] = 12;
		console.log(today);
	} else if (today[1] < 0) {
		console.log(today);
		today[0] = today[0] - 1;
		today[1] = 12 + today[1];
		console.log(today);
	}
	
	var outdated_before = today;
	
	if (show_outdated) {
		const warning_message = 'warning: this info is from before ' + construct_date_string(outdated_before) + ', and has a good chance of being outdated, because it is ' + lifespan_months + '+ months old<br>';
		var full_warning_string = '<span style="color:' + warning_color + ';">' + warning_message + '</span>';
	} else {
		const warning_message = 'stopped searching, because the info below is from before ' + construct_date_string(outdated_before) + ', and has a good chance of being outdated, because it is ' + lifespan_months + '+ months old<br>';
		var full_warning_string = '<span style="color:' + warning_color + ';">' + warning_message + '</span>';
	}

} else {
	// set earlier: var outdated_before = [22, 6, 9];
	
	if (show_outdated) {
		const warning_message = 'warning: this info is from before ' + construct_date_string(outdated_before) + ', and has a good chance of being outdated<br>';
		var full_warning_string = '<span style="color:' + warning_color + ';">' + warning_message + '</span>';
	} else {
		const warning_message = 'stopped searching, because the info below is from before ' + construct_date_string(outdated_before) + ', and has a good chance of being outdated<br>';
		var full_warning_string = '<span style="color:' + warning_color + ';">' + warning_message + '</span>';
	}
}

function process_date(date_array) {
	
	for (let i = 0; i < 3; i++) {
		let exp = outdated_before[i];
		let cur = date_array[i];
		
		if (cur == exp) {
			continue;
		}
		
		if (cur < exp) {
			// not outdated
			return [false, full_warning_string + construct_date_string(date_array)];
		} else if (cur > exp) {
			// outdated
			return [true, construct_date_string(date_array)];
		} else {
			continue;
		}
	}
	// exactly the same, not outdated
	return [true, construct_date_string(date_array)];
}