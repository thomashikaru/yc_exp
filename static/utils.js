// constants
// change the following prior to real experiment: trials_per_block, debug_mode, completion_code
const use_flask = false;
const trials_per_block = 85; // 85;
const stimulus_duration = 7000; // 7000
const post_stimulus_delay = 1500; // 1500
const fixation_duration = 500;
const completion_code = "00000000";
const math_duration = 7000;
const build_sent_duration = 30000;

const n_back_base = 20;
const vigilance_repeat_back_range = [5, 15];
const vigilance_frequency = 0.25;
const repeat_list_shuffle_block_size = 2;
const breaks_per_exp = 12;
const break_max_len = 180;
const num_lists = 12;
const debug_mode = true;

// instructions
const task_instructions = [
    "<p>TASK INSTRUCTIONS.</p> <p>This experiment should take around X minutes. " +
    "The progress bar at the top of the screen will indicate your progress in the experiment. " +
    "Do NOT reload the page during the experiment, as this will cause you to lose your progress.</p>",

    "<p>TASK INSTRUCTIONS.</p> <p>It is important that you pay attention during this study. " +
    "During the study, you will be receiving feedback on the correctness of your responses. " +
    "The tasks may be challenging and we don't expect perfect performance. " +
    "<b>However, if you miss a large percentage of the tasks, you will not get paid.</b></p>",

    "<p>TASK INSTRUCTIONS.</p> <p>Once you complete the experiment, you will be shown your completion code. " +
    "Be careful not to accidentally exit the experiment before getting your completion code.</p>",

    "<p>TASK INSTRUCTIONS.</p> <p>The first screen in each trial will show a sentence broken into 4 parts, in scrambled order. " +
    "Try to memorize this sentence. Press SPACE if you have seen the sentence before at <b>ANY</b> point during the study. " +
    "On the next screen, you will be asked to solve a basic math problem. " +
    "On the final screen of the trial, you will be asked to write the sentence that you saw previously from memory.</p>",

    "<p>TASK INSTRUCTIONS.</p> <p>Each screen in the trial has a time limit . " +
    "7 seconds to memorize the scrambled sentence, 7 seconds for the math question, and 30 seconds to write out the sentence from memory.</p>",

    "<p>TASK INSTRUCTIONS.</p> <p>You will now see a practice trial. </p>",
]

function makeRect(w, h, x, y, text) {
    return `<svg width="${w + 2 * x}" height="${h + 2 * y}">` +
        `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" style="fill:white;stroke:black;stroke-width:5;fill-opacity:0.0;stroke-opacity:1.0"/>` +
        `<text x="${2 * x}" y="${h / 3}" font-family="Verdana" font-size="28" fill="black" style="white-space: pre-line">${text}</text></g></svg>`
}

function makeGrid(tl, tr, bl, br) {
    return makeRect(400, 200, 10, 10, tl) +
        makeRect(400, 200, 10, 10, tr) +
        "<div>" +
        makeRect(400, 200, 10, 10, bl) +
        makeRect(400, 200, 10, 10, br)
}

function makeCueEn(verb) {
    return '<span style="font-size:40px;">__________ ' + verb + ' ____________________</span>';
}

function makeCueJp(verb) {
    return '<span style="font-size:40px;">______________________________ ' + verb + '</span>';
}

function makeMathQ(question) {
    return `<span style="font-size: 40px">${question}</span>`
}

// formatting function
function format(s) {
    return '<span style="font-size:40px;">' + s + '</span>';
}

function format_red(s) {
    return '<span style="font-size:40px;color:red">' + s + '</span>';
}

function format_green(s) {
    return '<span style="font-size:40px;color:green">' + s + '</span>';
}

function format_orange(s) {
    return '<span style="font-size:40px;color:orange">' + s + '</span>';
}

function standardize_whitespace(s) {
    return s.replaceAll("\s", " ");
}

function editDistance(str1 = '', str2 = '') {
    const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i = 1; i <= str1.length; i += 1) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }
    return track[str2.length][str1.length];
}

function get_stats(a) {
    var d = {};
    for (var i = 0; i < a.length; i++) {
        if (!(a[i].transitivity in d)) {
            d[a[i].transitivity] = {}
        }
        if (!(a[i].modifier_position in d[a[i].transitivity])) {
            d[a[i].transitivity][a[i].modifier_position] = {}
        }
        if (!(a[i].condition in d[a[i].transitivity][a[i].modifier_position])) {
            d[a[i].transitivity][a[i].modifier_position][a[i].condition] = 0
        }
        d[a[i].transitivity][a[i].modifier_position][a[i].condition]++;
    }
    return d
}

// saving data
function saveData(name, data) {
    var xhr = new XMLHttpRequest();
    if (use_flask) {
        xhr.open('POST', "{{url_for('save')}}");
    } else {
        xhr.open('POST', "../static/write_data.php");
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ filename: name, filedata: data }));
}
