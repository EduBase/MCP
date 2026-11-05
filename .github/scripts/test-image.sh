#!/usr/bin/env bash
# Start the server from an image over stdio and check that it answers as the expected version with its tools
set -e -u -o pipefail
image="$1"
version="$2"
{
	echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"image-test","version":"1.0.0"}}}'
	echo '{"jsonrpc":"2.0","method":"notifications/initialized"}'
	echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'
	sleep 5
} | timeout 60 docker run -i --rm -e EDUBASE_API_URL=https://www.edubase.net/api -e EDUBASE_API_APP=image-test -e EDUBASE_API_KEY=image-test "$image" > "${RUNNER_TEMP:-/tmp}/image-test.jsonl"
jq -es --arg version "$version" 'map(select(.id == 1))[0].result.serverInfo.version == $version' "${RUNNER_TEMP:-/tmp}/image-test.jsonl" >/dev/null || { echo "::error::The image does not answer as version $version"; exit 1; }
tools="$(jq -s 'map(select(.id == 2))[0].result.tools | length' "${RUNNER_TEMP:-/tmp}/image-test.jsonl")"
[[ "$tools" -gt 0 ]] || { echo "::error::The image lists no tools"; exit 1; }
echo "$image answers as version $version with $tools tools"
